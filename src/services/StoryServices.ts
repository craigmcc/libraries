// StoryServices -------------------------------------------------------------

// Services implementation for Story models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import AuthorServices from "./AuthorServices";
import SeriesServices from "./SeriesServices";
import VolumeServices from "./VolumeServices";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import * as SortOrder from "../models/SortOrder";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions, appendQuery, appendQueryWithName, appendQueryWithNames} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class StoryServices implements AbstractChildServices<Story>{

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.all"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.STORIES,
        }, query);
        return await library.$get("stories", options);
    }

    public async find(libraryId: number, storyId: number, query?: any): Promise<Story> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.find"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                id: storyId,
            }
        }, query);
        let results = await library.$get("stories", options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.find");
        }
    }

    public async insert(libraryId: number, story: Story): Promise<Story> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.insert"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            story.libraryId = libraryId; // No cheating
            const inserted = await Story.create(story, {
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

    public async remove(libraryId: number, storyId: number): Promise<Story> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.remove"
            );
        }
        const options = {
            where: {
                id: storyId,
                library_id: libraryId
            }
        }
        let removed = await Story.findOne(options);
        if (!removed) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.remove");
        }
        let count = await Story.destroy({
            where: { id: storyId }
        });
        if (count < 1) {
            throw new NotFound(
                `storyId: Cannot remove Story ${storyId}`,
                "StoryServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, storyId: number, story: Story): Promise<Story> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.update"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            story.id = storyId; // No cheating
            story.libraryId = libraryId; // No cheating
            let result: [number, Story[]] = await Story.update(story, {
                fields: fieldsWithId,
                transaction: transaction,
                where: {
                    id: storyId,
                    library_id: libraryId
                }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `storyId: Cannot update Story ${storyId}`,
                    "StoryServices.update");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId, storyId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Story Lookups *****

    public async active(libraryId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.active"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.STORIES,
            where: {
                active: true,
            }
        }, query);
        return await library.$get("stories", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Story> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.exact"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await library.$get("stories", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Story '${name}'`,
                "StoryServices.exact");
        }
        return results[0];
    }

    public async name(libraryId: number, name: string, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.name"
            );
        }
        let options: FindOptions = {};
        options = appendQuery({
            order: SortOrder.STORIES,
            where: {
                name: {[Op.iLike]: `%${name}%`}
            },
        }, query);
        return await library.$get("stories", options);
    }

    // ***** Story-Author Relationships *****

    public async authors(libraryId: number, storyId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.authors"
            );
        }
        const story = await Story.findOne({
            where: {
                id: storyId,
                library_id: libraryId,
            }
        })
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.authors"
            );
        }
        let options: FindOptions = appendQueryWithNames({
            order: SortOrder.AUTHORS,
        }, query);
        return await story.$get("authors", options);
    }

    // ***** Story-Series Relationships *****

    public async series(libraryId: number, storyId: number, query?: any): Promise<Series[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.series"
            );
        }
        const story = await Story.findOne({
            where: {
                id: storyId,
                library_id: libraryId,
            }
        })
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.series"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.SERIES,
        }, query);
        return await story.$get("series", options);
    }

    // ***** Story-Volume Relationships *****

    public async volumes(libraryId: number, storyId: number, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "StoryServices.volumes"
            );
        }
        const story = await Story.findOne({
            where: {
                id: storyId,
                library_id: libraryId,
            }
        })
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "StoryServices.volumes"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.VOLUMES,
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
    public async findStory(context: string, libraryId: number, storyId: number, query?: any): Promise<Story> {
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

const fields: string[] = [
    "active",
    "copyright",
    "libraryId",
    "name",
    "notes",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
