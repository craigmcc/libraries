// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseParentServices from "./BaseParentServices";
import AccessToken from "../models/AccessToken";
import RefreshToken from "../models/RefreshToken";
import User from "../models/User";
import * as SortOrder from "../models/SortOrder";
import {hashPassword} from "../oauth/oauth-utils";
import {BadRequest, NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Classes ------------------------------------------------------------

class UserServices extends BaseParentServices<User> {

    constructor () {
        super(new User(), SortOrder.USERS, [
            "active",
            "password",
            "scope",
            "username",
        ]);
    }

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<User[]> {
        const results: User[] = await super.all(query);
        results.forEach(result => {
            result.password = "";
        })
        return results;
    }

    public async find(userId: number, query?: any): Promise<User> {
        const result: User = await super.find(userId, query);
        result.password = "";
        return result;
    }

    public async insert(user: User): Promise<User> {
        if (!user.password) {
            throw new BadRequest(
                `password: Is required`,
                "UserServices.insert"
            );
        }
        user.password = await hashPassword(user.password); // TODO - leaked back to caller
        const result: User = await super.insert(user);
        result.password = "";
        return result;
    }

    public async remove(userId: number): Promise<User> {
        const result: User = await super.remove(userId);
        result.password = "";
        return result;
    }

    public async update(userId: number, user: User): Promise<User> {
        if (user.password && (user.password.length > 0)) {
            user.password = await hashPassword(user.password); // TODO - leaked back to caller
        } else {
            // @ts-ignore
            delete user.password; // TODO - this might be broken
        }
        const result: User = await super.update(userId, user);
        result.password = "";
        return result;
    }

    // Model-Specific Methods ------------------------------------------------

    // TODO: accessTokens(userId: number, query?: any): Promise<AccessToken[]>

    public async exact(name: string, query?: any): Promise<User> {
        let options: FindOptions = appendPaginationOptions({
            where: {
                username: name
            }
        }, query);
        let results: User[] = await User.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing User '${name}'`,
                "UserServices.exact()");
        }
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
