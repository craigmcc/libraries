// AuthorServices ------------------------------------------------------------

// Services implementation for Author models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import * as SortOrder from "../models/SortOrder";
import Volume from "../models/Volume";
import {NotFound} from "../util/http-errors";
import {appendPagination} from "../util/query-parameters";

// Public Objects ------------------------------------------------------------

export class AuthorServices {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.all"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.AUTHORS,
        }, query);
        return await library.$get("authors", options);
    }

    public async find(libraryId: number, authorId: number, query?: any): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.find"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                id: authorId,
            }
        }, query);
        let results = await library.$get("authors", options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.find");
        }
    }

    public async insert(libraryId: number, author: Author): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.insert"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            author.library_id = libraryId; // No cheating
            const inserted = await Author.create(author, {
                fields: fields,
                transaction: transaction
            });
            await transaction.commit();
            return inserted;
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    public async remove(libraryId: number, authorId: number): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.remove"
            );
        }
        const options = {
            where: {
                id: authorId,
                library_id: libraryId
            }
        }
        let removed = await Author.findOne(options);
        if (!removed) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.remove");
        }
        let count = await Author.destroy({
            where: { id: authorId }
        });
        if (count < 1) {
            throw new NotFound(
                `authorId: Cannot remove Author ${authorId}`,
                "AuthorServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, authorId: number, author: Author): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.update"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            author.id = authorId; // No cheating
            author.library_id = libraryId; // No cheating
            let result: [number, Author[]] = await Author.update(author, {
                fields: fieldsWithId,
                transaction: transaction,
                where: {
                    id: authorId,
                    library_id: libraryId
                }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `authorId: Cannot update Author ${authorId}`,
                    "AuthorServices.update");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId, authorId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Author Lookups *****

    public async active(libraryId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.active"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.AUTHORS,
            where: {
                active: true,
            }
        }, query);
        return await library.$get("authors", options);
    }

    public async exact(libraryId: number, firstName: string, lastName: string, query?: any): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.exact"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                first_name: firstName,
                last_name: lastName,
            }
        }, query);
        let results = await library.$get("authors", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Author '${firstName} ${lastName}'`,
                "AuthorServices.exact");
        }
        return results[0];
    }

    public async name(libraryId: number, name: string, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.name"
            );
        }
        const names = name.trim().split(" ");
        let options: FindOptions = {};
        if (names.length < 2) {
            options = appendQuery({
                order: SortOrder.AUTHORS,
                where: {
                    [Op.or]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[0]}%`},
                    }
                },
            }, query);
        } else {
            options = appendQuery({
                order: SortOrder.AUTHORS,
                where: {
                    [Op.and]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[1]}%`},
                    }
                },
            }, query);
        }
        return await library.$get("authors", options);
    }

}

export default new AuthorServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withLibrary) {
        include.push(Library);
    }
    /*
        if ("" === query.withSeries) {
            include.push(Series);
        }
        if ("" === query.withStories) {
            include.push(Story);
        }
    */
    if ("" === query.withVolumes) {
        include.push(Volume);
    }
    if (include.length > 0) {
        options.include = include;
    }

    return options;

}

const fields: string[] = [
    "active",
    "first_name",
    "last_name",
    "library_id",
    "notes",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
