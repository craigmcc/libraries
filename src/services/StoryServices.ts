// StoryServices -------------------------------------------------------------

// Services implementation for Story models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import AuthorServices from "./AuthorServices";
import LibraryServices from "./LibraryServices";
import SeriesServices from "./SeriesServices";
import VolumeServices from "./VolumeServices";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class StoryServices implements AbstractChildServices<Story>{

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Story[]> {
        const library = await LibraryServices.read("StoryServices.all", libraryId);
        const options: FindOptions = this.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await library.$get("stories", options);
    }

    public async find(libraryId: number, storyId: number, query?: any): Promise<Story> {
        return await this.read("StoryServices.find", libraryId, storyId, query);
    }

    public async insert(libraryId: number, story: Story): Promise<Story> {
        const library = await LibraryServices.read("StoryServices.insert", libraryId);
        try {
            story.libraryId = libraryId; // No cheating
            return await Story.create(story, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "StoryServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "StoryServices.insert"
                );
            }
        }
    }

    public async remove(libraryId: number, storyId: number): Promise<Story> {
        const library = await LibraryServices.read("StoryServices.remove", libraryId);
        const story = await this.read("StoryServices.remove", libraryId, storyId);
        await Story.destroy({
            where: { id: storyId },
        });
        return story;
    }

    public async update(libraryId: number, storyId: number, story: Story): Promise<Story> {
        const library = await LibraryServices.read("StoryServices.update", libraryId);
        try {
            story.libraryId = libraryId; // No cheating
            const results = await Story.update(story, {
                fields: FIELDS_WITH_ID,
                returning: true,
                where: {
                    id: storyId,
                    libraryId: libraryId,
                },
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `stroyId: Missing Story ${storyId}`,
                    "StoryServices.update",
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "StoryServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "StoryServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async authors(libraryId: number, storyId: number, query?: any): Promise<Author[]> {
        const library = await LibraryServices.read("StoryServices.authors", libraryId);
        const story = await this.read("StoryServices.authors", libraryId, storyId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await story.$get("authors", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Story> {
        const library = await LibraryServices.read("StoryServices.exact", libraryId);
        const options = this.appendIncludeOptions({
            where: {
                name: name,
            }
        }, query);
        const results = await library.$get("stories", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Story '${name}'`,
                "StoryServices.exact");
        }
        return results[0];
    }

    public async series(libraryId: number, storyId: number, query?: any): Promise<Series[]> {
        const library = await LibraryServices.read("StoryServices.series", libraryId);
        const story = await this.read("StorySeries.series", libraryId, storyId);
        const options: FindOptions = SeriesServices.appendMatchOptions({
            order: SortOrder.SERIES,
        }, query);
        return await story.$get("series", options);
    }

    public async volumes(libraryId: number, storyId: number, query?: any): Promise<Volume[]> {
        const library = await LibraryServices.read("StoryServices.volumes", libraryId);
        const story = await this.read("StorySeries.volumes", libraryId, storyId);
        const options: FindOptions = VolumeServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await story.$get("volumes", options);
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAuthors                    Include related Authors
     * * withLibrary                    Include parent Library
     * * withSeries                     Include related Series
     * * withVolumes                    Include related Volumes
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
        if ("" === query.withLibrary) {
            include.push(Library);
        }
        if ("" === query.withSeries) {
            include.push(Series);
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
     * * active                         Select active Stories
     * * name={wildcard}                Select Stories name with matching {wildcard}
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
        if (Object.keys(where).length > 0) {
            options.where = where;
        }
        return options;
    }

    /**
     * Find and return the specified Story.
     * @param context                   Call context for errors
     * @param libraryId                 ID of owning Library
     * @param storyId                   ID of requested Story
     * @param query                     Optional include query parameters
     */
    public async read(context: string, libraryId: number, storyId: number, query?: any): Promise<Story> {
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: storyId,
                libraryId: libraryId,
            }
        }, query);
        const story = await Story.findOne(options);
        if (story) {
            return story;
        } else {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                context
            )
        }
    }

}

export default new StoryServices();

// Private Objects -----------------------------------------------------------

const FIELDS: string[] = [
    "active",
    "copyright",
    "libraryId",
    "name",
    "notes",
];

const FIELDS_WITH_ID: string[] = [
    ...FIELDS,
    "id"
];
