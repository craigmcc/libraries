// AuthorServices ------------------------------------------------------------

// Services implementation for Author models.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import AuthorSeries from "../models/AuthorSeries";
import AuthorStory from "../models/AuthorStory";
import AuthorVolume from "../models/AuthorVolume";
import Database from "../models/Database";
import Library from "../models/Library";
import Series from "../models/Series";
import * as SortOrder from "../models/SortOrder";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {NotFound} from "../util/http-errors";
import {appendQuery, appendQueryWithName, appendQueryWithNames} from "../util/query-parameters";
import logger from "../util/server-logger";

// Public Objects ------------------------------------------------------------

export class AuthorServices {

    // Standard CRUD Methods -------------------------------------------------

    public async all(libraryId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.all"
            );
        }
        let options: FindOptions = appendQueryWithNames({
            order: SortOrder.AUTHORS,
        }, query);
        return await library.$get("authors", options);
    }

    public async find(libraryId: number, authorId: number, query?: any): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.find"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                id: authorId,
            }
        }, query);
        let results = await library.$get("authors", options);
        if (results.length === 1) {
            return results[0];
        } else {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.find");
        }
    }

    public async insert(libraryId: number, author: Author): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.insert"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            author.libraryId = libraryId; // No cheating
            const inserted = await Author.create(author, {
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

    public async remove(libraryId: number, authorId: number): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.remove"
            );
        }
        const options = {
            where: {
                id: authorId,
                library_id: libraryId
            }
        }
        let removed = await Author.findOne(options);
        if (!removed) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.remove");
        }
        let count = await Author.destroy({
            where: { id: authorId }
        });
        if (count < 1) {
            throw new NotFound(
                `authorId: Cannot remove Author ${authorId}`,
                "AuthorServices.remove");
        }
        return removed;
    }

    public async update(libraryId: number, authorId: number, author: Author): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.update"
            );
        }
        let transaction;
        try {
            transaction = await Database.transaction();
            author.id = authorId; // No cheating
            author.libraryId = libraryId; // No cheating
            let result: [number, Author[]] = await Author.update(author, {
                fields: fieldsWithId,
                transaction: transaction,
                where: {
                    id: authorId,
                    library_id: libraryId
                }
            });
            if (result[0] < 1) {
                throw new NotFound(
                    `authorId: Cannot update Author ${authorId}`,
                    "AuthorServices.update");
            }
            await transaction.commit();
            transaction = null;
            return await this.find(libraryId, authorId);
        } catch (error) {
            if (transaction) {
                await transaction.rollback();
            }
            throw error;
        }
    }

    // Model-Specific Methods ------------------------------------------------

    // ***** Author Lookups *****

    public async active(libraryId: number, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.active"
            );
        }
        let options: FindOptions = appendQuery({
            order: SortOrder.AUTHORS,
            where: {
                active: true,
            }
        }, query);
        return await library.$get("authors", options);
    }

    public async exact(libraryId: number, firstName: string, lastName: string, query?: any): Promise<Author> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.exact"
            );
        }
        let options: FindOptions = appendQuery({
            where: {
                first_name: firstName,
                last_name: lastName,
            }
        }, query);
        let results = await library.$get("authors", options);
        if (results.length !== 1) {
            throw new NotFound(
                `name: Missing Author '${firstName} ${lastName}'`,
                "AuthorServices.exact");
        }
        return results[0];
    }

    public async name(libraryId: number, name: string, query?: any): Promise<Author[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.name"
            );
        }
        const names = name.trim().split(" ");
        let options: FindOptions = {};
        if (names.length < 2) {
            options = appendQuery({
                order: SortOrder.AUTHORS,
                where: {
                    [Op.or]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[0]}%`},
                    }
                },
            }, query);
        } else {
            options = appendQuery({
                order: SortOrder.AUTHORS,
                where: {
                    [Op.and]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[1]}%`},
                    }
                },
            }, query);
        }
        return await library.$get("authors", options);
    }

    // ***** Author-Series Relationships *****

    public async series(libraryId: number, authorId: number, query?: any): Promise<Series[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.series"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.series"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.SERIES,
        }, query);
        return await author.$get("series", options);
    }

    public async seriesExclude(libraryId: number, authorId: number, seriesId: number): Promise<Series> {
        logger.info({
            context: "AuthorServices.seriesExclude",
            libraryId: libraryId,
            authorId: authorId,
            seriesId: seriesId,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.seriesExclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.seriesExclude"
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
                "AuthorServices.seriesExclude"
            );
        }
        await AuthorSeries.destroy({
            where: {
                author_id: authorId,
                series_id: seriesId
            }
        });
        return series;
    }

    public async seriesInclude(libraryId: number, authorId: number, seriesId: number, principal: boolean | null): Promise<Series> {
        logger.info({
            context: "AuthorServices.seriesInclude",
            libraryId: libraryId,
            authorId: authorId,
            seriesId: seriesId,
            principal: principal,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.seriesInclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.seriesInclude"
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
                "AuthorServices.seriesInclude"
            );
        }
        await AuthorSeries.create({
            author_id: authorId,
            series_id: seriesId,
            principal: principal ? true : false,
        });
        return series;
    }

    // ***** Author-Story Relationships *****

    public async stories(libraryId: number, authorId: number, query?: any): Promise<Story[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.stories"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.stories"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.STORIES,
        }, query);
        return await author.$get("stories", options);
    }

    public async storiesExclude(libraryId: number, authorId: number, storyId: number): Promise<Story> {
        logger.info({
            context: "AuthorServices.storiesExclude",
            libraryId: libraryId,
            authorId: authorId,
            storyId: storyId,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.storiesExclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesExclude"
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
                "AuthorServices.storiesExclude"
            );
        }
        await AuthorStory.destroy({
            where: {
                author_id: authorId,
                story_id: storyId
            }
        });
        return story;
    }

    public async storiesInclude(libraryId: number, authorId: number, storyId: number, principal: boolean | null): Promise<Story> {
        logger.info({
            context: "AuthorServices.storiesInclude",
            libraryId: libraryId,
            authorId: authorId,
            storyId: storyId,
            principal: principal,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.storiesInclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.storiesInclude"
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
                "AuthorServices.storiesInclude"
            );
        }
        await AuthorStory.create({
            author_id: authorId,
            story_id: storyId,
            principal: principal ? true : false,
        });
        return story;
    }

    // ***** Author-Volume Relationships *****

    public async volumes(libraryId: number, authorId: number, query?: any): Promise<Volume[]> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.volumes"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.volumes"
            );
        }
        let options: FindOptions = appendQueryWithName({
            order: SortOrder.VOLUMES,
        }, query);
        return await author.$get("volumes", options);
    }

    public async volumesExclude(libraryId: number, authorId: number, volumeId: number): Promise<Volume> {
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.volumesExclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.volumesExclude"
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
                "AuthorServices.volumesExclude"
            );
        }
        await AuthorVolume.destroy({
            where: {
                author_id: authorId,
                volume_id: volumeId
            }
        });
        return volume;
    }

    public async volumesInclude(libraryId: number, authorId: number, volumeId: number, principal: boolean | null): Promise<Volume> {
        logger.info({
            context: "AuthorServices.storiesInclude",
            libraryId: libraryId,
            authorId: authorId,
            volumeId: volumeId,
            principal: principal,
        });
        const library = await Library.findByPk(libraryId);
        if (!library) {
            throw new NotFound(
                `libraryId: Missing Library ${libraryId}`,
                "AuthorServices.volumesInclude"
            );
        }
        const author = await Author.findOne({
            where: {
                id: authorId,
                library_id: libraryId
            }
        })
        if (!author) {
            throw new NotFound(
                `authorId: Missing Author ${authorId}`,
                "AuthorServices.volumesInclude"
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
                "AuthorServices.volumesInclude"
            );
        }
        await AuthorVolume.create({
            author_id: authorId,
            volume_id: volumeId,
            principal: principal ? true : false,
        });
        return volume;
    }

}

export default new AuthorServices();

// Private Objects -----------------------------------------------------------

const fields: string[] = [
    "active",
    "first_name",
    "last_name",
    "library_id",
    "notes",
];

const fieldsWithId: string[] = [
    ...fields,
    "id"
];
