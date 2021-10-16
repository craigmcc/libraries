// OAuthOrchestratorHandlers -------------------------------------------------

// Handlers for use by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {
    Identifier,
    OrchestratorHandlers,
    AuthenticateUser,
    CreateAccessToken,
    CreateRefreshToken,
    RetrieveAccessToken,
    RetrieveRefreshToken,
    RevokeAccessToken,
} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import {generateRandomToken, verifyPassword} from "./OAuthUtils";
import OAuthAccessToken from "../models/AccessToken";
import OAuthRefreshToken from "../models/RefreshToken";
import OAuthUser from "../models/User";
import {NotFound} from "../util/HttpErrors";

// Private Objects -----------------------------------------------------------

const authenticateUser: AuthenticateUser
    = async (username: string, password: string) =>
{

    // Look up the specified user
    const oauthUser = await OAuthUser.findOne({
        where: { username: username }
    });
    if (!oauthUser) {
        throw new NotFound(
            "username: Missing or invalid username or password",
            "OAuthOrchestratorHandlers.authenticateUser()"
        );
    }
    if (!oauthUser.active) {
        // Creative subterfuge to not give anything away
        throw new NotFound(
            "username: Invalid or missing username or password",
            "OAuthOrchestratorHandlers.authenticateUser"
        );
    }

    // Validate against the specified password
    if (!(await verifyPassword(password, oauthUser.password))) {
        // Creative subterfuge to not give anything away
        throw new NotFound(
            "username: Missing or invalid username or password",
            "OAuthOrchestratorHandlers.authenticateUser"
        );
    }

    // Return the requested result
    return {
        scope: oauthUser.scope,
        userId: oauthUser.id
    }

}

const createAccessToken: CreateAccessToken
    = async (expires: Date, scope :string, userId: Identifier) =>
{

    // Prepare the OAuthAccessToken to be created
    let incomingId: number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<OAuthAccessToken> = {
        expires: expires,
        scope: scope,
        token: await generateRandomToken(),
        userId: incomingId,
    }

    // Create the access token and return the relevant data
    const outgoing = await OAuthAccessToken.create(incoming, {
        fields: [ "expires", "scope", "token", "userId" ]
    });
    return {
        expires: outgoing.expires,
        scope: outgoing.scope,
        token: outgoing.token,
        userId: outgoing.id,
    };

}

const createRefreshToken: CreateRefreshToken
    = async (accessToken: string, expires: Date, userId: Identifier) =>
{

    // Prepare the OAuthRefreshToken to be created
    let incomingId: number;
    if (typeof userId === "string") {
        incomingId = parseInt(userId);
    } else {
        incomingId = userId;
    }
    const incoming: Partial<OAuthRefreshToken> = {
        accessToken: accessToken,
        expires: expires,
        token: await generateRandomToken(),
        userId: incomingId,
    }

    // Create the refresh token and return the relevant data
    const outgoing = await OAuthRefreshToken.create(incoming, {
        fields: [ "accessToken", "expires", "token", "userId" ]
    });
    return {
        accessToken: outgoing.accessToken,
        expires: outgoing.expires,
        token: outgoing.token,
        userId: outgoing.id,
    };

}

const retrieveAccessToken: RetrieveAccessToken = async (token: string) => {

    // Look up the specified token
    const oauthAccessToken = await OAuthAccessToken.findOne({
        where: { token: token }
    });
    if (!oauthAccessToken) {
        throw new NotFound(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveAccessToken"
        );
    }

    // Return the requested result
    return {
        expires: oauthAccessToken.expires,
        scope: oauthAccessToken.scope,
        token: oauthAccessToken.token,
        userId: oauthAccessToken.userId,
    }

}

const retrieveRefreshToken: RetrieveRefreshToken = async (token: string) => {

    // Look up the specified token
    const oauthRefreshToken = await OAuthRefreshToken.findOne({
        where: { token: token }
    });
    if (!oauthRefreshToken) {
        throw new NotFound(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.retrieveRefreshToken"
        );
    }

    // Return the requested result
    return {
        accessToken: oauthRefreshToken.accessToken,
        expires: oauthRefreshToken.expires,
        token: oauthRefreshToken.token,
        userId: oauthRefreshToken.userId,
    }

}

const revokeAccessToken: RevokeAccessToken = async (token: string): Promise<void> => {

    // Look up the specified token
    const oauthAccessToken = await OAuthAccessToken.findOne({
        where: { token: token }
    });
    if (!oauthAccessToken) {
        throw new NotFound(
            "token: Missing or invalid token",
            "OAuthOrchestratorHandlers.revokeAccessToken"
        );
    }

    // Revoke any associated refresh tokens
    await OAuthRefreshToken.destroy({
        where: { accessToken: token }
    });

    // Revoke the access token as well
    await OAuthAccessToken.destroy({
        where: { token: token }
    });

}

// Public Objects ------------------------------------------------------------

export const OAuthOrchestratorHandlers: OrchestratorHandlers = {
    authenticateUser: authenticateUser,
    createAccessToken: createAccessToken,
    createRefreshToken: createRefreshToken,
    retrieveAccessToken: retrieveAccessToken,
    retrieveRefreshToken: retrieveRefreshToken,
    revokeAccessToken: revokeAccessToken,
}

export default OAuthOrchestratorHandlers;

