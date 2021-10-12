// UserServices --------------------------------------------------------------

// Services implementation for User models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractParentServices from "./AbstractParentServices";
import Database from "../models/Database";
import User from "../models/User";
import * as SortOrder from "../models/SortOrder";
import {hashPassword} from "../oauth/oauth-utils";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Classes ------------------------------------------------------------

export class UserServices extends AbstractParentServices<User> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<User[]> {
        let options: FindOptions = appendQuery({
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
        let options: FindOptions = appendQuery({
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
        const newUser: Partial<User> = {
            ...user,
            password: await hashPassword(user.password)
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            const inserted: User = await User.create(newUser, {
                fields: fields,
                transaction: transaction
            });
            inserted.password = "";
            await transaction.commit();
            return inserted;
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    public async remove(userId: number): Promise<User> {
        let removed = await User.findByPk(userId);
        if (!removed) {
            throw new NotFound(
                `userId: Missing User ${userId}`,
                "UserServices.remove");
        }
        let count = await User.destroy({
            where: { id: userId }
        });
        if (count < 1) {
            throw new NotFound(
                `userId: Cannot remove User ${userId}`,
                "UserServices.remove");
        }
        return removed;
    }

    public async update(userId: number, user: User): Promise<User> {
        const original = await User.findByPk(userId);
        if (!original) {
            throw new NotFound(`userId: Missing user ID ${userId}`);
        }
        const updatedUser: Partial<User> = {
            ...user
        }
        if (user.password && (user.password.length > 0)) {
            updatedUser.password = await hashPassword(user.password);
        } else {
            updatedUser.password = original.password;
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            updatedUser.id = userId;
            let results: [number, User[]] = await User.update(updatedUser, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: userId }
            });
            await transaction.commit();
            transaction = null;
            if (results[0] < 1) {
                throw new NotFound(
                    `userId: Cannot update User ${userId}`,
                    "UserServices.update()");
            }
            return await this.find(userId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** User Lookups *****

    public async active(query?: any): Promise<User[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.USERS,
            where: {
                active: true
            }
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            // @ts-ignore
            result.password = "";
        });
        return results;
    }

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

    public async name(name: string, query?: any): Promise<User[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.USERS,
            where: {
                username: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        const results = await User.findAll(options);
        results.forEach(result => {
            // @ts-ignore
            result.password = "";
        })
        return results;
    }

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

const fields: string[] = [
    "active",
    "password",
    "scope",
    "username",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
