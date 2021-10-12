// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractParentServices from "./AbstractParentServices";
import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import * as SortOrder from "../models/SortOrder";
import {hashPassword} from "../oauth/oauth-utils";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Classes ------------------------------------------------------------

export class UserServices extends AbstractParentServices<User> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<User[]> {
        let options: FindOptions = this.appendMatchOptions({
            order: SortOrder.USERS
        }, query);
        const results: User[] = await User.findAll(options);
        results.forEach(result => {
            // @ts-ignore
            result.password = "";
        })
        return results;
    }

    public async find(userId: number, query?: any): Promise<User> {
        let options: FindOptions = this.appendIncludeOptions({
            where: { id: userId }
        }, query);
        let results = await User.findAll(options);
        if (results.length === 1) {
            // @ts-ignore
            results[0].password = "";
            return results[0];
        } else {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.find");
        }
    }

    public async insert(user: User): Promise<User> {
        if (!user.password) {
            throw new BadRequest(
                `password: Is required`,
                "UserServices.insert"
            );
        }
        user.password = await hashPassword(user.password); // TODO - leaked back to caller
        try {
            const inserted: User = await User.create(user, {
                fields: FIELDS,
            });
            inserted.password = "";
            return inserted;
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "UserServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "UserServices.insert"
                );
            }
        }
    }

    public async remove(userId: number): Promise<User> {
        const removed = await User.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.remove");
        }
        await User.destroy({
            where: { id: userId }
        });
        return removed;
    }

    public async update(userId: number, user: User): Promise<User> {
        if (user.password && (user.password.length > 0)) {
            user.password = await hashPassword(user.password); // TODO - leaked back to caller
        } else {
            // @ts-ignore
            delete user.password; // TODO - this might be broken
        }
        try {
            const found = await User.findByPk(userId);
            if (!found) {
                throw new NotFound(`userId: Missing User ${userId}`);
            }
            user.id = userId; // No cheating
            const result = await User.update(user, {
                fields: FIELDS_WITH_ID,
                where: { id: userId }
            });
            return await this.find(userId);
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "UserServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "UserServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // TODO: accessTokens(userId: number, query?: any): Promise<AccessToken[]>

    public async exact(name: string, query?: any): Promise<User> {
        let options: FindOptions = appendQuery({
            where: {
                username: name
            }
        }, query);
        let results = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing User '${name}'`,
                "UserServices.exact()");
        }
        // @ts-ignore
        results[0].password = "";
        return results[0];
    }

    // TODO: refreshTokens(userId: number, query?: any): Promise<AccessToken[]>

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAccessTokens               Include child AccessTokens
     * * withRefreshTokens              Include child RefreshTokens
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withAccessTokens) {
            include.push(AccessToken);
        }
        if ("" === query.withRefreshTokens) {
            include.push(RefreshToken);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /*
     * Supported match query parameters:
     * * active                         Select active Users
     * * username={wildcard}            Select Users with usernames matching {wildcard}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        const where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.username) {
            where.username = {[Op.iLike]: `%${query.username}%`}
        }
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

    // TODO - private helpers for token include/match stuff

}

export default new UserServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPaginationOptions(options, query);

    // Inclusion parameters - none

    return options;

}

const FIELDS: string[] = [
    "active",
    "password",
    "scope",
    "username",
];

const FIELDS_WITH_ID: string[] = [
    ...FIELDS,
    "id"
];
