// VolumeServices ------------------------------------------------------------

// Services implementation for Volume models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import AuthorServices from "./AuthorServices";
import StoryServices from "./StoryServices";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Story from "../models/Story";
import Volume from "../models/Volume";
import VolumeStory from "../models/VolumeStory";
import * as SortOrder from "../models/SortOrder";
import {NotFound} from "../util/HttpErrors";
import {appendPaginationOptions, appendQuery, appendQueryWithName, appendQueryWithNames} from "../util/QueryParameters";
import logger from "../util/ServerLogger";

// Public Objects ------------------------------------------------------------

export class VolumeServices {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.all"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.VOLUMES,
        }, query);
        return await library.$get("volumes", options);
    }

    public async find(libraryId: number, volumeId: number, query?: any): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.find"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                id: volumeId,
            }
        }, query);
        let results = await library.$get("volumes", options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.find");
        }
    }

    public async insert(libraryId: number, volume: Volume): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.insert"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            volume.libraryId = libraryId; // No cheating
            const inserted = await Volume.create(volume, {
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

    public async remove(libraryId: number, volumeId: number): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.remove"
            );
        }
        const options = {
            where: {
                id: volumeId,
                library_id: libraryId
            }
        }
        let removed = await Volume.findOne(options);
        if (!removed) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.remove");
        }
        let count = await Volume.destroy({
            where: { id: volumeId }
        });
        if (count < 1) {
            throw new NotFound(
                `volumeId: Cannot remove Volume ${volumeId}`,
                "VolumeServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, volumeId: number, volume: Volume): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.update"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            volume.id = volumeId; // No cheating
            volume.libraryId = libraryId; // No cheating
            let result: [number, Volume[]] = await Volume.update(volume, {
                fields: fieldsWithId,
                transaction: transaction,
                where: {
                    id: volumeId,
                    library_id: libraryId
                }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `volumeId: Cannot update Volume ${volumeId}`,
                    "VolumeServices.update");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId, volumeId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Volume Lookups *****

    public async active(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.active"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.VOLUMES,
            where: {
                active: true,
            }
        }, query);
        return await library.$get("volumes", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.exact"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await library.$get("volumes", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "VolumeServices.exact");
        }
        return results[0];
    }

    public async name(libraryId: number, name: string, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.name"
            );
        }
        const names = name.trim().split(" ");
        let options: FindOptions = {};
        options = appendQuery({
            order: SortOrder.VOLUMES,
            where: {
                name: {[Op.iLike]: `%${name}%`}
            },
        }, query);
        return await library.$get("volumes", options);
    }

    // ***** Volume-Author Relationships *****

    public async authors(libraryId: number, volumeId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.authors"
            );
        }
        const volume = await Volume.findOne({
            where: {
                id: volumeId,
                library_id: libraryId,
            }
        })
        if (!volume) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.authors"
            );
        }
        let options: FindOptions = appendQueryWithNames({
            order: SortOrder.AUTHORS,
        }, query);
        return await volume.$get("authors", options);
    }

    // ***** Volume-Story Relationships *****

    public async stories(libraryId: number, volumeId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.stories"
            );
        }
        const volume = await Volume.findOne({
            where: {
                id: volumeId,
                library_id: libraryId,
            }
        })
        if (!volume) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.stories"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.STORIES,
        }, query);
        return await volume.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, volumeId: number, storyId: number): Promise<Story> {
        logger.info({
            context: "VolumeServices.storiesExclude",
            libraryId: libraryId,
            volumeId: volumeId,
            storyId: storyId,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.storiesExclude"
            );
        }
        const volume = await Volume.findOne({
            where: {
                id: volumeId,
                library_id: libraryId
            }
        })
        if (!volume) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.storiesExclude"
            );
        }
        const story = await Story.findOne({
            where: {
                id: storyId,
                library_id: libraryId
            }
        })
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "VolumeServices.storiesExclude"
            );
        }
        await VolumeStory.destroy({
            where: {
                story_id: storyId,
                volume_id: volumeId,
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, volumeId: number, storyId: number): Promise<Story> {
        logger.info({
            context: "VolumeServices.storiesInclude",
            libraryId: libraryId,
            volumeId: volumeId,
            storyId: storyId,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "VolumeServices.storiesInclude"
            );
        }
        const volume = await Volume.findOne({
            where: {
                id: volumeId,
                library_id: libraryId
            }
        })
        if (!volume) {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                "VolumeServices.storiesInclude"
            );
        }
        const story = await Story.findOne({
            where: {
                id: storyId,
                library_id: libraryId
            }
        })
        if (!story) {
            throw new NotFound(
                `storyId: Missing Story ${storyId}`,
                "VolumeServices.storiesInclude"
            );
        }
        await VolumeStory.create({
            story_id: storyId,
            volume_id: volumeId,
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
     * * active                         Select active Volumes
     * * name={wildcard}                Select Volumes name with matching {wildcard}
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
     * Find and return the specified Volume.
     * @param context                   Call context for errors
     * @param libraryId                 ID of owning Library
     * @param volumeId                  ID of requested Volume
     * @param query                     Optional include query parameters
     */
    public async findVolume(context: string, libraryId: number, volumeId: number, query?: any): Promise<Volume> {
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: volumeId,
                libraryId: libraryId,
            }
        }, query);
        const volume = await Volume.findOne(options);
        if (volume) {
            return volume;
        } else {
            throw new NotFound(
                `volumeId: Missing Volume ${volumeId}`,
                context
            )
        }
    }

}

export default new VolumeServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "active",
    "copyright",
    "isbn",
    "libraryId",
    "location",
    "name",
    "notes",
    "read",
    "type",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
