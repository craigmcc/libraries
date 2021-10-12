// SeriesServices -------------------------------------------------------------

// Services implementation for Series models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import AuthorServices from "./AuthorServices";
import LibraryServices from "./LibraryServices";
import StoryServices from "./StoryServices";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import SeriesStory from "../models/SeriesStory";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class SeriesServices implements AbstractChildServices<Series> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Series[]> {
        const library = await LibraryServices.findLibrary("SeriesServices.all", libraryId);
        const options: FindOptions = this.appendMatchOptions({
            order: SortOrder.SERIES,
        }, query);
        return await library.$get("series", options);
    }

    public async find(libraryId: number, seriesId: number, query?: any): Promise<Series> {
        return await this.findSeries("SeriesServices.find", libraryId, seriesId, query);
    }

    public async insert(libraryId: number, series: Series): Promise<Series> {
        const library = await LibraryServices.findLibrary("SeriesServices.insert", libraryId);
        try {
            series.libraryId = libraryId; // No cheating
            return await Series.create(series, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "SeriesServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "SeriesServices.insert"
                );
            }
        }
    }

    public async remove(libraryId: number, seriesId: number): Promise<Series> {
        const library = await LibraryServices.findLibrary("SeriesServices.remove", libraryId);
        const series = await this.findSeries("SeriesServices.remove", libraryId, seriesId);
        await Series.destroy({
            where: { id: seriesId },
        });
        return series;
    }

    public async update(libraryId: number, seriesId: number, series: Series): Promise<Series> {
        const library = await LibraryServices.findLibrary("SeriesServices.update", libraryId);
        try {
            series.libraryId = libraryId; // No cheating
            const results = await Series.update(series, {
                fields: FIELDS_WITH_ID,
                returning: true,
                where: {
                    id: seriesId,
                    libraryId: libraryId,
                },
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `seriesId: Missing Series ${seriesId}`,
                    "SeriesServices.update",
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

    public async authors(libraryId: number, seriesId: number, query?: any): Promise<Author[]> {
        const library = await LibraryServices.findLibrary("SeriesServices.authors", libraryId);
        const series = await this.findSeries("SeriesServices.authors", libraryId, seriesId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await series.$get("authors", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Series> {
        const library = await LibraryServices.findLibrary("SeriesServices.exact", libraryId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const results = await library.$get("series", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Series '${name}'`,
                "SeriesServices.exact");
        }
        return results[0];
    }

    public async stories(libraryId: number, seriesId: number, query?: any): Promise<Story[]> {
        const library = await LibraryServices.findLibrary("SeriesServices.stories", libraryId);
        const series = await this.findSeries("SeriesServices.stories", libraryId, seriesId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await series.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, seriesId: number, storyId: number): Promise<Story> {
        await LibraryServices.findLibrary("SeriesServices.storiesExclude", libraryId);
        await this.findSeries("SeriesServices.storiesExclude", libraryId, seriesId);
        const story = await StoryServices.findStory("SeriesServices.storiesExclude", libraryId, storyId);
        await SeriesStory.destroy({
            where: {
                seriesId: seriesId,
                storyId: storyId,
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, seriesId: number, storyId: number, ordinal: number | null): Promise<Story> {
        await Library.findByPk(libraryId);
        await this.findSeries("SeriesServices.storiesExclude", libraryId, seriesId);
        const story = await StoryServices.findStory("SeriesServices.storiesExclude", libraryId, storyId);
        await SeriesStory.create({
            seriesId: seriesId,
            storyId: storyId,
            ordinal: ordinal,
        });
        return story;
    }

    // Public Helpers --------------------------------------------------------

    /**
     * Supported include query parameters:
     * * withAuthors                    Include related Authors
     * * withLibrary                    Include parent Library
     * * withStories                    Include related Stories
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
        if ("" === query.withStories) {
            include.push(Story);
        }
        if (include.length > 0) {
            options.include = include;
        }
        return options;
    }

    /**
     * Supported match query parameters:
     * * active                         Select active Series
     * * name={wildcard}                Select Series with name matching {wildcard}
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
     * Find and return the specified Series.
     * @param context                   Call context for errors
     * @param libraryId                 ID of owning Library
     * @param seriesId                  ID of requested Series
     * @param query                     Optional include query parameters
     */
    public async findSeries(context: string, libraryId: number, seriesId: number, query?: any): Promise<Series> {
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: seriesId,
                libraryId: libraryId,
            }
        }, query);
        const series = await Series.findOne(options);
        if (series) {
            return series;
        } else {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                context
            )
        }
    }

}

export default new SeriesServices();

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
