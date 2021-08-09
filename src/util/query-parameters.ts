// query-parameters ----------------------------------------------------------

// Utility methods for appending to Sequelize options based on query parameters.

// External Modules ----------------------------------------------------------

import {FindOptions, Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Story from "../models/Story";
import Series from "../models/Series";
import Volume from "../models/Volume";

// Public Functions ----------------------------------------------------------

/**
 * Append standard pagination query parameters (if present), and return the
 * updated options.
 */
export const appendPagination = (options: FindOptions, query: any): FindOptions => {
    if (query.limit) {
        let value = parseInt(query.limit, 10);
        if (isNaN(value)) {
            throw new Error(`limit: '${query.limit}' is not a number`);
        } else {
            options.limit = value;
        }
    }
    if (query.offset) {
        let value = parseInt(query.offset, 10);
        if (isNaN(value)) {
            throw new Error(`offset: '${query.offset}' is not a number`);
        } else {
            options.offset = value;
        }
    }
    return options;
}

/**
 * Append pagination and inclusion parameters, and return the updated options.
 */
export const appendQuery = (options: FindOptions, query: any): FindOptions => {

    if (!query) {
        return options;
    }
    options = appendPagination(options, query);

    // Inclusion parameters
    let include = [];
    if ("" === query.withAuthors) {
        include.push(Author);
    }
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
 * Append pagination and inclusion parameters, plus name matching parameter (if any),
 * and return the updated options.
*/
export const appendQueryWithName = (options: FindOptions, query?: any): FindOptions => {
    options = appendQuery(options, query);
    if (query.name) {
        options = {
            ...options,
            where: {
                name: {[Op.iLike]: `%${query.name}%`}
            },
        }
    }
    return options;
}

/**
 * Append pagination and inclusion parameters, plus name matching parameter
 * for first_name/last_name fields (if any), and return the updated options.
 */
export const appendQueryWithNames = (options: FindOptions, query?: any): FindOptions => {
    options = appendQuery(options, query);
    if (query.name) {
        const names = query.name.trim().split(" ");
        if (names.length < 2) {
            options = {
                ...options,
                where: {
                    [Op.or]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[0]}%`},
                    }
                },
            };
        } else {
            options = {
                ...options,
                where: {
                    [Op.and]: {
                        first_name: {[Op.iLike]: `%${names[0]}%`},
                        last_name: {[Op.iLike]: `%${names[1]}%`},
                    }
                },
            };
        }
    }
    return options;
}

