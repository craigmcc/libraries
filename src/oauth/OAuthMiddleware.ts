// OAuthMiddleware -----------------------------------------------------------

// Express middleware to enforce OAuth scope limits.

// External Modules ----------------------------------------------------------

import {InvalidScopeError, OAuthError} from "@craigmcc/oauth-orchestrator";
import {
    ErrorRequestHandler,
    NextFunction,
    Request,
    RequestHandler,
    Response
} from "express";

// Internal Modules ----------------------------------------------------------

import OAuthOrchestrator from "./OAuthOrchestrator";
import LibraryServices from "../services/LibraryServices";
import {Forbidden} from "../util/HttpErrors";
import logger from "../util/ServerLogger";

const AUTHORIZATION_HEADER = "Authorization";
const NODE_ENV: string | undefined = process.env.NODE_ENV;

let oauthEnabled: boolean = true;
if (process.env.OAUTH_ENABLED !== undefined) {
    oauthEnabled = (process.env.OAUTH_ENABLED === "true");
}
logger.info({
    context: "Startup",
    msg: "Initialize OAuth Access Protection",
    enabled: `${oauthEnabled}`
})

// Public Functions ----------------------------------------------------------

/**
 * Dump request details (for debugging only).
 */
export const dumpRequestDetails: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        logger.info({
            context: "OAuthMiddleware.dumpRequestDetails",
            msg: `${req.method} ${req.url}`,
            authorization: `${req.get("authorization")}`,
            baseUrl: `${req.baseUrl}`,
            contentLength: `${req.get("Content-Length")}`,
            contentType: `${req.get("Content-Type")}`,
            originalUrl: `${req.originalUrl}`,
            params: `${JSON.stringify(req.params)}`,
            path: `${req.path}`,
            query: `${JSON.stringify(req.query)}`,
            token: `${res.locals.token}`
        });
        next();
    }

/**
 * Handle OAuthError errors by formatting and sending the
 * appropriate HTTP response.
 */
export const handleOAuthError: ErrorRequestHandler =
    (error: Error, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof OAuthError) {
            res.status(error.status).send({
                context: error.context ? error.context : undefined,
                // Do *not* include "inner" if present!
                message: error.message,
                name: error.name ? error.name : undefined,
                status: error.status ? error.status : undefined,
            });
        } else {
            next(error);
        }
    }

/**
 * Require "admin" scope (for a specific library) to handle this request.
 */
export const requireAdmin: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireAdmin"
                );
            }
            const required = (await mapLibraryId(req)) + ":admin";
            await authorizeToken(token, required);
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Require just a validated token, no matter what scopes might be allowed.
 *
 * In development mode, make sure there is a token but do not bother to
 * authorize it.  That makes it possible to log out in development mode.
 */
export const requireAny: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        const token = extractToken(req);
        if (oauthEnabled) {
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireAny"
                );
            }
            const required = "";
            await authorizeToken(token, required);
            res.locals.token = token;
            next();
        } else {
            res.locals.token = token;
            next();
        }
    }

/**
 * Require no token at all.
 */
export const requireNone: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        next();
    }

/**
 * Require that we *not* be in production mode.
 */
export const requireNotProduction: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if ("production" === NODE_ENV) {
            throw new Forbidden(
                "This request is not allowed in production mode",
                "OAuthMiddleware.requireNotProduction"
            );
        } else {
            next();
        }
    }

/**
 * Require "regular" scope (for a specific Library) to handle this request.
 * If the token has "admin" scope on this Library, it will also pass.
 */
export const requireRegular: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireRegular"
                );
            }
            const required = mapLibraryId(req) + " regular";
            try {
                await authorizeToken(token, required);
            } catch (error) {
                if (error instanceof InvalidScopeError) {
                    await authorizeToken(token, required.replace("regular","admin"));
                } else {
                    throw error;
                }
            }
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

/**
 * Require "superuser" scope to handle this request.
 */
export const requireSuperuser: RequestHandler =
    async (req: Request, res: Response, next: NextFunction) => {
        if (oauthEnabled) {
            const token = extractToken(req);
            if (!token) {
                throw new Forbidden(
                    "No access token presented",
                    "OAuthMiddleware.requireSuperuser"
                );
            }
            await authorizeToken(token, "superuser");
            res.locals.token = token;
            next();
        } else {
            next();
        }
    }

// Private Functions ---------------------------------------------------------

/**
 * Request the OAuthServer infrastructure to authorize the specified token
 * for the specified required scope.  Returns normally if successful.
 *
 * @param token         The access token to be authorized
 * @param required      Required scope for the access token to be used
 *
 * @throws              Error returned by OAuthServer.authorize()
 *                      if token was not successfully authorized
 */
const authorizeToken = async (token: string, required: string): Promise<void> => {
    try {
        await OAuthOrchestrator.authorize(token, required);
    } catch (error) {
        throw error;
    }

}

/**
 * Extract and return the presented access token in this request (if any).
 *
 * IMPLEMENTATION NOTE:  We *only* support the "Authorization" header
 * mechanism to receive a bearer token that RFC 6750 defines (Section 2.1).
 *
 * @param               The HTTP request being processed
 *
 * @returns             Extracted access token (if any) or null
 */
const extractToken = (req: Request) : string | null => {
    const header: string | undefined = req.header(AUTHORIZATION_HEADER);
    if (!header) {
        return null;
    }
    const fields: string[] = header.split(" ");
    if (fields.length != 2) {
        return null;
    }
    if (fields[0] !== "Bearer") {
        return null;
    }
    return fields[1];
}

// TODO - keep it up to date when libraries info changes
const mapping = new Map<number, string>();

const mapLibrariesLoad = async (): Promise<void> => {
    const libraries = await LibraryServices.all();
    libraries.forEach(library => {
        mapping.set(library.id, library.name);
    });
}

/**
 * Map the libraryId parameter on this request to a corresponding scope value
 * that must be authorized for the request's access token.
 *
 * @param req           The HTTP request being processed
 *
 * @returns scope value to be included in the authorize request.
 */
const mapLibraryId = async (req: Request): Promise<string> => {
    if (mapping.size === 0) {
        await mapLibrariesLoad();
    }
    const libraryId: string | null = req.params.libraryId;
    if (!libraryId) {
        return "notincluded";
    }
    const scope: string | undefined =
        (libraryId === "1") ? "personal" : "test"; // TODO - dynamic lookup!!!
    if (!scope) {
        return "notknown";
    }
    return scope;
}
