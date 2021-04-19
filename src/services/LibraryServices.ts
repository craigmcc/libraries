// LibraryServices -----------------------------------------------------------

// Services implementation for Library models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractServices from "./AbstractServices";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Volume from "../models/Volume";
import * as SortOrder from "../models/SortOrder";
import {NotFound} from "../util/http-errors";
import {appendPagination} from "../util/query-parameters";
import Story from "../models/Story";

// Public Classes ------------------------------------------------------------

export class LibraryServices extends AbstractServices<Library> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.LIBRARIES
        }, query);
        return Library.findAll(options);
    }

    public async find(libraryId: number, query?: any): Promise<Library> {
        let options: FindOptions = appendQuery({
            where: { id: libraryId }
        }, query);
        let results = await Library.findAll(options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.find");
        }
    }

    public async insert(library: Library): Promise<Library> {
        let transaction;
        try {
            transaction = await Database.transaction();
            const inserted: Library = await Library.create(library, {
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

    public async remove(libraryId: number): Promise<Library> {
        let removed = await Library.findByPk(libraryId);
        if (!removed) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.remove");
        }
        let count = await Library.destroy({
            where: { id: libraryId }
        });
        if (count < 1) {
            throw new NotFound(
                `libraryId: Cannot remove Library ${libraryId}`,
                "LibraryServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, library: Library): Promise<Library> {
        let transaction;
        try {
            transaction = await Database.transaction();
            library.id = libraryId;
            let result: [number, Library[]] = await Library.update(library, {
                fields: fieldsWithId,
                transaction: transaction,
                where: { id: libraryId }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `libraryId: Cannot update Library ${libraryId}`,
                    "LibraryServices.update()");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Library Lookups *****

    public async active(query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.LIBRARIES,
            where: {
                active: true
            }
        }, query);
        return Library.findAll(options);
    }

    public async exact(name: string, query?: any): Promise<Library> {
        let options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await Library.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryServices.exact()");
        }
        return results[0];
    }

    public async name(name: string, query?: any): Promise<Library[]> {
        let options: FindOptions = appendQuery({
            order: SortOrder.LIBRARIES,
            where: {
                name: { [Op.iLike]: `%${name}%` }
            }
        }, query);
        return Library.findAll(options);
    }

    // ***** Child Table Lookups *****

    public async authors(libraryId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.authors"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.AUTHORS,
        }, query);
        return await library.$get("authors", options);
    }

    public async stories(libraryId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.volumes"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.STORIES,
        }, query);
        return await library.$get("stories", options);
    }

    public async volumes(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "LibraryServices.volumes"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.VOLUMES,
        }, query);
        return await library.$get("volumes", options);
    }

}

export default new LibraryServices();

// Private Objects -----------------------------------------------------------

const appendQuery = (options: FindOptions, query?: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAuthors) {
        include.push(Author);
    }
    /*
        if ("" === query.withSeries) {
            include.push(Series);
        }
    */
    if ("" === query.withStories) {
        include.push(Story);
    }
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
    "name",
    "notes",
    "scope",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
