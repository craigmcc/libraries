// SeriesServices -------------------------------------------------------------

// Services implementation for Series models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Series from "../models/Series";
import SeriesStory from "../models/SeriesStory";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import {NotFound} from "../util/http-errors";
import {appendQuery, appendQueryWithName, appendQueryWithNames} from "../util/query-parameters";
import logger from "../util/server-logger";

// Public Objects ------------------------------------------------------------

export class SeriesServices {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Series[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.all"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.SERIES,
        }, query);
        return await library.$get("series", options);
    }

    public async find(libraryId: number, seriesId: number, query?: any): Promise<Series> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.find"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                id: seriesId,
            }
        }, query);
        let results = await library.$get("series", options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.find");
        }
    }

    public async insert(libraryId: number, series: Series): Promise<Series> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.insert"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            series.libraryId = libraryId; // No cheating
            const inserted = await Series.create(series, {
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

    public async remove(libraryId: number, seriesId: number): Promise<Series> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.remove"
            );
        }
        const options = {
            where: {
                id: seriesId,
                library_id: libraryId
            }
        }
        let removed = await Series.findOne(options);
        if (!removed) {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.remove");
        }
        let count = await Series.destroy({
            where: { id: seriesId }
        });
        if (count < 1) {
            throw new NotFound(
                `seriesId: Cannot remove Series ${seriesId}`,
                "SeriesServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, seriesId: number, series: Series): Promise<Series> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.update"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            series.id = seriesId; // No cheating
            series.libraryId = libraryId; // No cheating
            let result: [number, Series[]] = await Series.update(series, {
                fields: fieldsWithId,
                transaction: transaction,
                where: {
                    id: seriesId,
                    library_id: libraryId
                }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `seriesId: Cannot update Series ${seriesId}`,
                    "SeriesServices.update");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId, seriesId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Series Lookups *****

    public async active(libraryId: number, query?: any): Promise<Series[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.active"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.STORIES,
            where: {
                active: true,
            }
        }, query);
        return await library.$get("series", options);
    }

    public async exact(libraryId: number, name: string, query?: any): Promise<Series> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.exact"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                name: name
            }
        }, query);
        let results = await library.$get("series", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Series '${name}'`,
                "SeriesServices.exact");
        }
        return results[0];
    }

    public async name(libraryId: number, name: string, query?: any): Promise<Series[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.name"
            );
        }
        const names = name.trim().split(" ");
        let options: FindOptions = {};
        options = appendQuery({
            order: SortOrder.SERIES,
            where: {
                name: {[Op.iLike]: `%${name}%`}
            },
        }, query);
        return await library.$get("series", options);
    }

    // ***** Series-Author Relationships *****

    public async authors(libraryId: number, seriesId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.authors"
            );
        }
        const series = await Series.findOne({
            where: {
                id: seriesId,
                library_id: libraryId,
            }
        })
        if (!series) {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.authors"
            );
        }
        let options: FindOptions = appendQueryWithNames({
            order: SortOrder.AUTHORS,
        }, query);
        return await series.$get("authors", options);
    }

    // ***** Series-Story Relationships *****

    public async stories(libraryId: number, seriesId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.stories"
            );
        }
        const series = await Series.findOne({
            where: {
                id: seriesId,
                library_id: libraryId,
            }
        })
        if (!series) {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.stories"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.VOLUMES,
        }, query);
        return await series.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, seriesId: number, storyId: number): Promise<Story> {
        logger.debug({
            context: "SeriesServices.storiesExclude",
            libraryId: libraryId,
            seriesId: seriesId,
            storyId: storyId,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.storiesExclude"
            );
        }
        const series = await Series.findOne({
            where: {
                id: seriesId,
                library_id: libraryId
            }
        })
        if (!series) {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.storiesExclude"
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
                "SeriesServices.storiesExclude"
            );
        }
        await SeriesStory.destroy({
            where: {
                series_id: seriesId,
                story_id: storyId
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, seriesId: number, storyId: number, ordinal: number | null): Promise<Story> {
        logger.debug({
            context: "SeriesServices.storiesInclude",
            libraryId: libraryId,
            seriesId: seriesId,
            storyId: storyId,
            ordinal: ordinal,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "SeriesServices.storiesInclude"
            );
        }
        const series = await Series.findOne({
            where: {
                id: seriesId,
                library_id: libraryId
            }
        })
        if (!series) {
            throw new NotFound(
                `seriesId: Missing Series ${seriesId}`,
                "SeriesServices.storiesInclude"
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
                "SeriesServices.storiesInclude"
            );
        }
        await SeriesStory.create({
            series_id: seriesId,
            story_id: storyId,
            ordinal: ordinal,
        });
        return story;
    }

}

export default new SeriesServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "active",
    "copyright",
    "library_id",
    "name",
    "notes",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
