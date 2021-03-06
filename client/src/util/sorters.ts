// sorters -------------------------------------------------------------------

// Utility functions to sort arrays of objects in the preferred order.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Story from "../models/Story";
import Series from "../models/Series";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const AUTHORS = (authors: Author[]): Author[] => {
    return authors.sort(function (a, b) {
        const aName = a.last_name + "|" + a.first_name;
        const bName = b.last_name + "|" + b.first_name;
        if (aName > bName) {
            return 1;
        } else if (aName < bName) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const SERIES = (serieses: Series[]): Series[] => {
    return serieses.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

export const STORIES = (stories: Story[]): Story[] => {
    return stories.sort(function (a, b) {
        if (a.ordinal === null) {
            return (b.ordinal === null ? 0 : -1);
        } else if (b.ordinal === null) {
            return 1;
        } else {
            return a.ordinal - b.ordinal;
        }

    });
}

export const VOLUMES = (volumes: Volume[]): Volume[] => {
    return volumes.sort(function (a, b) {
        if (a.name > b.name) {
            return 1;
        } else if (a.name < b.name) {
            return -1;
        } else {
            return 0;
        }
    });
}

