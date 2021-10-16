// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import { Order } from "sequelize";

// Public Objects ------------------------------------------------------------

export const AUTHORS: Order  = [
    [ "libraryId", "ASC" ],
    [ "lastName", "ASC" ],
    [ "firstFame", "ASC" ],
];

export const LIBRARIES: Order = [
    [ "name", "ASC" ],
];

export const SERIES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

export const STORIES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

export const USERS: Order = [
    [ "username", "ASC" ],
];

export const VOLUMES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];
