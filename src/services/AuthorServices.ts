// AuthorServices ------------------------------------------------------------

// Services implementation for Author models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import LibraryServices from "./LibraryServices";
import SeriesServices from "./SeriesServices";
import StoryServices from "./StoryServices";
import VolumeServices from "./VolumeServices";
import Author from "../models/Author";
import AuthorSeries from "../models/AuthorSeries";
import AuthorStory from "../models/AuthorStory";
import AuthorVolume from "../models/AuthorVolume";
import Library from "../models/Library";
import Series from "../models/Series";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class AuthorServices implements AbstractChildServices<Author>{

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Author[]> {
        const library = await LibraryServices.read("AuthorServices.all", libraryId);
        const options: FindOptions = this.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await library.$get("authors", options);
    }

    public async find(libraryId: number, authorId: number, query?: any): Promise<Author> {
        return await this.read("AuthorServices.find", libraryId, authorId, query);
    }

    public async insert(libraryId: number, author: Author): Promise<Author> {
        const library = await LibraryServices.read("AuthorServices.insert", libraryId);
        try {
            author.libraryId = libraryId; // No cheating
            return await Author.create(author, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "AuthorServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "AuthorServices.insert"
                );
            }
        }
    }

    public async remove(libraryId: number, authorId: number): Promise<Author> {
        const library = await LibraryServices.read("AuthorServices.remove", libraryId);
        const author = await this.read("AuthorServices.remove", libraryId, authorId);
        await Author.destroy({
            where: { id: authorId },
        });
        return author;
    }

    public async update(libraryId: number, authorId: number, author: Author): Promise<Author> {
        const library = await LibraryServices.read("AuthorServices.update", libraryId);
        try {
            author.libraryId = libraryId; // No cheating
            const results = await Author.update(author, {
                fields: FIELDS_WITH_ID,
                returning: true,
                where: {
                    id: authorId,
                    libraryId: libraryId,
                },
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `authorId: Missing Author ${authorId}`,
                    "AuthorServices.update",
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "AuthorServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "AuthorServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async exact(libraryId: number, firstName: string, lastName: string, query?: any): Promise<Author> {
        const library = await LibraryServices.read("AuthorServices.exact", libraryId);
        const options = this.appendIncludeOptions({
            where: {
                first_name: firstName,
                last_name: lastName,
            }
        }, query);
        const results = await library.$get("authors", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Author '${firstName} ${lastName}'`,
                "AuthorServices.exact");
        }
        return results[0];
    }

    public async series(libraryId: number, authorId: number, query?: any): Promise<Series[]> {
        const library = await LibraryServices.read("AuthorServices.series", libraryId);
        const author = await this.read("AuthorSeries.series", libraryId, authorId);
        const options: FindOptions = SeriesServices.appendIncludeOptions({
            order: SortOrder.SERIES,
        }, query);
        return await author.$get("series", options);
    }

    public async seriesExclude(libraryId: number, authorId: number, seriesId: number): Promise<Series> {
        await LibraryServices.read("AuthorServices.seriesExclude", libraryId);
        await this.read("AuthorServices.seriesExclude", libraryId, authorId);
        const series = await SeriesServices.read("AuthorServices.seriesExclude", libraryId, seriesId);
        await AuthorSeries.destroy({
            where: {
                authorId: authorId,
                seriesId: seriesId,
            }
        });
        return series;
    }

    public async seriesInclude(libraryId: number, authorId: number, seriesId: number, principal: boolean | null): Promise<Series> {
        await LibraryServices.read("AuthorServices.seriesInclude", libraryId);
        await this.read("AuthorServices.seriesInclude", libraryId, authorId);
        const series = await SeriesServices.read("AuthorServices.seriesInclude", libraryId, seriesId);
        await AuthorSeries.destroy({
            where: {
                authorId: authorId,
                seriesId: seriesId,
                principal: principal,
            }
        });
        return series;
    }

    public async stories(libraryId: number, authorId: number, query?: any): Promise<Story[]> {
        const library = await LibraryServices.read("AuthorServices.stories", libraryId);
        const author = await this.read("AuthorServices.stories", libraryId, authorId);
        const options: FindOptions = StoryServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await author.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, authorId: number, storyId: number): Promise<Story> {
        await LibraryServices.read("AuthorServices.storiesExclude", libraryId);
        await this.read("AuthorServices.storiesExclude", libraryId, authorId);
        const story = await StoryServices.read("AuthorServices.storiesExclude", libraryId, storyId);
        await AuthorStory.destroy({
            where: {
                authorId: authorId,
                storyId: storyId,
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, authorId: number, storyId: number, principal: boolean | null): Promise<Story> {
        await LibraryServices.read("AuthorServices.storiesInclude", libraryId);
        await this.read("AuthorServices.storiesInclude", libraryId, authorId);
        const story = await StoryServices.read("AuthorServices.storiesInclude", libraryId, storyId);
        await AuthorStory.create({
            authorId: authorId,
            storyId: storyId,
            principal: principal,
        });
        return story;
    }

    public async volumes(libraryId: number, authorId: number, query?: any): Promise<Volume[]> {
        const library = await LibraryServices.read("AuthorServices.volumes", libraryId);
        const author = await this.read("AuthorServices.volumes", libraryId, authorId);
        const options: FindOptions = VolumeServices.appendMatchOptions({
            order: SortOrder.VOLUMES,
        }, query);
        return await author.$get("volumes", options);
    }

    public async volumesExclude(libraryId: number, authorId: number, volumeId: number): Promise<Volume> {
        await LibraryServices.read("AuthorServices.volumesExclude", libraryId);
        await this.read("AuthorServices.volumesExclude", libraryId, authorId);
        const volume = await VolumeServices.read("AuthorServices.volumesExclude", libraryId, volumeId);
        await AuthorVolume.destroy({
            where: {
                authorId: authorId,
                volumeId: volumeId,
            }
        });
        return volume;
    }

    public async volumesInclude(libraryId: number, authorId: number, volumeId: number, principal: boolean | null): Promise<Volume> {
        await LibraryServices.read("AuthorServices.volumesInclude", libraryId);
        await this.read("AuthorServices.volumesInclude", libraryId, authorId);
        const volume = await VolumeServices.read("AuthorServices.volumesInclude", libraryId, volumeId);
        await AuthorVolume.create({
            authorId: authorId,
            volumeId: volumeId,
            principal: principal,
        });
        return volume;
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withLibrary                    Include parent Library
     * * withSeries                     Include related Series
     * * withStories                    Include related Stories
     * * withVolumes                    Include related Volumes
     */
    public appendIncludeOptions(options: FindOptions, query?: any): FindOptions {
        if (!query) {
            return options;
        }
        options = appendPaginationOptions(options, query);
        const include: any = options.include ? options.include : [];
        if ("" === query.withLibrary) {
            include.push(Library);
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
     * * active                         Select active Authors
     * * name={wildcard}                Select Authors with name matching {wildcard}
     */
    public appendMatchOptions(options: FindOptions, query?: any): FindOptions {
        options = this.appendIncludeOptions(options, query);
        if (!query) {
            return options;
        }
        let where: any = options.where ? options.where : {};
        if ("" === query.active) {
            where.active = true;
        }
        if (query.name) {
            const names = query.name.trim().split(" ");
            const firstMatch = names[0];
            const lastMatch = (names.length > 1) ? names[1] : names[0];
            where = {
                ...where,
                [Op.or]: {
                    firstName: {[Op.iLike]: `%${firstMatch}%`},
                    lastName: {[Op.iLike]: `%${lastMatch}%`},
                }
            }
        }
        const count = Object.getOwnPropertyNames(where).length
            + Object.getOwnPropertySymbols(where).length;
        if (count > 0) {
            options.where = where;
        }
        return options;
    }

    /**
     * Find and return the specified Author.
     * @param context                   Call context for errors
     * @param libraryId                 ID of owning Library
     * @param authorId                  ID of requested Author
     * @param query                     Optional include query parameters
     */
    public async read(context: string, libraryId: number, authorId: number, query?: any): Promise<Author> {
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: authorId,
                libraryId: libraryId,
            }
        }, query);
        const author = await Author.findOne(options);
        if (author) {
            return author;
        } else {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                context
            )
        }
    }

}

export default new AuthorServices();

// Private Objects -----------------------------------------------------------

const FIELDS: string[] = [
    "active",
    "firstName",
    "lastName",
    "libraryId",
    "notes",
];

const FIELDS_WITH_ID: string[] = [
    ...FIELDS,
    "id"
];
