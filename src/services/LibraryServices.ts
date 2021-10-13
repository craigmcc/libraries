// LibraryServices -----------------------------------------------------------

// Services implementation for Library models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractParentServices from "./AbstractParentServices";
import AuthorServices from "./AuthorServices";
import SeriesServices from "./SeriesServices";
import StoryServices from "./StoryServices";
import VolumeServices from "./VolumeServices";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Classes ------------------------------------------------------------

export class LibraryServices extends AbstractParentServices<Library> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(query?: any): Promise<Library[]> {
        let options: FindOptions = this.appendMatchOptions({
            order: SortOrder.LIBRARIES
        }, query);
        return await Library.findAll(options);
    }

    public async find(libraryId: number, query?: any): Promise<Library> {
        return await this.read("LibraryServices.find", libraryId, query);
    }

    public async insert(library: Library): Promise<Library> {
        try {
            return await Library.create(library, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "LibraryServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "LibraryServices.insert"
                );
            }
        }
    }

    public async remove(libraryId: number): Promise<Library> {
        const library = await this.read("LibraryServices.remove", libraryId);
        await Library.destroy({
            where: { id: libraryId }
        });
        return library;
    }

    public async update(libraryId: number, library: Library): Promise<Library> {
        try {
            library.id = libraryId; // No cheating
            const results = await Library.update(library, {
                fields: FIELDS_WITH_ID,
                returning: true,
                where: { id: libraryId },
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `libraryId: Missing Library ${libraryId}`,
                    "LibraryServices.update",
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "FacilityServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "FacilityServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async authors(libraryId: number, query?: any): Promise<Author[]> {
        const library = await this.read("LibraryServices.authors", libraryId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await library.$get("authors", options);
    }

    public async exact(name: string, query?: any): Promise<Library> {
        let options: FindOptions = this.appendIncludeOptions({
            where: {
                name: name
            }
        }, query);
        const results = await Library.findAll(options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Library '${name}'`,
                "LibraryServices.exact()");
        }
        return results[0];
    }

    public async series(libraryId: number, query?: any): Promise<Series[]> {
        const library = await this.read("LibraryServices.series", libraryId);
        const options: FindOptions = SeriesServices.appendMatchOptions({
            order: SortOrder.SERIES,
        }, query);
        return await library.$get("series", options);
    }

    public async stories(libraryId: number, query?: any): Promise<Story[]> {
        const library = await this.read("LibraryServices.stories", libraryId);
        const options: FindOptions = StoryServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await library.$get("stories", options);
    }

    public async volumes(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await this.read("LibraryServices.volumes", libraryId);
        const options: FindOptions = VolumeServices.appendMatchOptions({
            order: SortOrder.VOLUMES,
        }, query);
        return await library.$get("volumes", options);
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAuthors                    Include child Authors
     * * withSeries                     Include child Series
     * * withStories                    Include child Stories
     * * withVolumes                    Include child Volumes
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withAuthors) {
            include.push(Author);
        }
        if ("" === query.withSeries) {
            include.push(Series);
        }
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

    /**
     * Supported match query parameters:
     * * active                         Select active Libraries
     * * name={wildcard}                Select Libraries with name matching {wildcard}
     * * scope={scope}                  Select Libraries with scope exact matching {scope}
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
        if (query.name) {
            where.name = { [Op.iLike]: `%${query.name}%` };
        }
        if (query.scope) {
            where.scope = query.scope;
        }
        return options;
    }

    /**
     * Find and return the requested Library.
     * @param context                   Call context for errors
     * @param libraryId                 ID of requested Library
     * @param query                     Optional include query parameters
     */
    public async read(context: string, libraryId: number, query?: any): Promise<Library> {
        const options: FindOptions = this.appendIncludeOptions({
            where: { id: libraryId }
        }, query);
        const library = await Library.findOne(options);
        if (library) {
            return library;
        } else {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                context);
        }
    }

}

export default new LibraryServices();

// Private Objects -----------------------------------------------------------

const FIELDS: string[] = [
    "active",
    "name",
    "notes",
    "scope",
];

const FIELDS_WITH_ID: string[] = [
    ...FIELDS,
    "id"
];
