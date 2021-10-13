// VolumeServices ------------------------------------------------------------

// Services implementation for Volume models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op, ValidationError} from "sequelize";

// Internal Modules ----------------------------------------------------------

import AbstractChildServices from "./AbstractChildServices";
import AuthorServices from "./AuthorServices";
import LibraryServices from "./LibraryServices";
import StoryServices from "./StoryServices";
import Author from "../models/Author";
import Library from "../models/Library";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import Volume from "../models/Volume";
import VolumeStory from "../models/VolumeStory";
import {BadRequest, NotFound, ServerError} from "../util/HttpErrors";
import {appendPaginationOptions} from "../util/QueryParameters";

// Public Objects ------------------------------------------------------------

export class VolumeServices extends AbstractChildServices<Volume> {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Volume[]> {
        const library = await LibraryServices.read("VolumeServices.all", libraryId);
        const options: FindOptions = this.appendMatchOptions({
            order: SortOrder.VOLUMES,
        }, query);
        return await library.$get("volumes", options);
    }

    public async find(libraryId: number, volumeId: number, query?: any): Promise<Volume> {
        return await this.read("VolumeServices.find", libraryId, volumeId, query);
    }

    public async insert(libraryId: number, volume: Volume): Promise<Volume> {
        const library = await LibraryServices.read("VolumeServices.insert", libraryId);
        try {
            volume.libraryId = libraryId; // No cheating
            return await Volume.create(volume, {
                fields: FIELDS,
            });
        } catch (error) {
            if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    "VolumeServices.insert"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "VolumeServices.insert"
                );
            }
        }
    }

    public async remove(libraryId: number, volumeId: number): Promise<Volume> {
        const library = await LibraryServices.read("VolumeServices.remove", libraryId);
        const volume = await this.read("VolumeServices.remove", libraryId, volumeId);
        await Volume.destroy({
            where: { id: volumeId },
        });
        return volume;
    }

    public async update(libraryId: number, volumeId: number, volume: Volume): Promise<Volume> {
        const library = await LibraryServices.read("VolumeServices.update", libraryId);
        try {
            volume.libraryId = libraryId; // No cheating
            const results = await Volume.update(volume, {
                fields: FIELDS_WITH_ID,
                returning: true,
                where: {
                    id: volumeId,
                    libraryId: libraryId,
                },
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `volumeId: Missing Volume ${volumeId}`,
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
                    "VolumeServices.update"
                );
            } else {
                throw new ServerError(
                    error as Error,
                    "VolumeServices.update"
                );
            }
        }
    }

    // Model-Specific Methods ------------------------------------------------

    public async authors(libraryId: number, volumeId: number, query?: any): Promise<Author[]> {
        const library = await LibraryServices.read("VolumeServices.authors", libraryId);
        const volume = await this.read("VolumeServices.authors", libraryId, volumeId);
        const options: FindOptions = AuthorServices.appendMatchOptions({
            order: SortOrder.AUTHORS,
        }, query);
        return await volume.$get("authors", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Volume> {
        const library = await LibraryServices.read("VolumeServices.exact", libraryId);
        const options: FindOptions = this.appendIncludeOptions({
            where: { name: name }
        }, query);
        const results = await library.$get("volumes", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Volume '${name}'`,
                "VolumeServices.exact");
        }
        return results[0];
    }

    public async stories(libraryId: number, volumeId: number, query?: any): Promise<Story[]> {
        const library = await LibraryServices.read("VolumeServices.stories", libraryId);
        const volume = await this.read("VolumeServices.stories", libraryId, volumeId);
        const options: FindOptions = StoryServices.appendMatchOptions({
            order: SortOrder.STORIES,
        }, query);
        return await volume.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, volumeId: number, storyId: number): Promise<Story> {
        await LibraryServices.read("VolumeServices.storiesExclude", libraryId);
        await this.read("VolumeServices.storiesExclude", libraryId, volumeId);
        const story = await StoryServices.read("VolumeServices.storiesExclude", libraryId, storyId);
        await VolumeStory.destroy({
            where: {
                storyId: storyId,
                volumeId: volumeId,
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, volumeId: number, storyId: number): Promise<Story> {
        await LibraryServices.read("VolumeServices.storiesInclude", libraryId);
        await this.read("VolumeServices.storiesInclude", libraryId, volumeId);
        const story = await StoryServices.read("VolumeServices.storiesInclude", libraryId, storyId);
        await VolumeStory.create({
            storyId: storyId,
            volumeId: volumeId,
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
    public async read(context: string, libraryId: number, volumeId: number, query?: any): Promise<Volume> {
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

const FIELDS: string[] = [
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

const FIELDS_WITH_ID: string[] = [
    ...FIELDS,
    "id"
];
