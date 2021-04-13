// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import { Order } from "sequelize";

// Public Objects ------------------------------------------------------------

export const AUTHORS: Order  = [
    [ "libraryId", "ASC" ],
    [ "lastName", "ASC" ],
    [ "firstName", "ASC" ],
];

export const LIBRARIES: Order = [
    [ "name", "ASC" ],
];

export const STORIES: Order = [
    [ "libraryId", "ASC" ],
    [ "name", "ASC" ],
];

