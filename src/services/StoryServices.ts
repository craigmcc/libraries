// StoryServices -------------------------------------------------------------

// Services implementation for Story models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import BaseChildServices from "./BaseChildServices";
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
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class StoryServices extends BaseChildServices<Story, Library>{

    constructor () {
        super(new Library(), new Story(), SortOrder.STORIES, [
            "active",
            "copyright",
            "libraryId",
            "name",
            "notes",
        ]);
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

}

export default new StoryServices();
