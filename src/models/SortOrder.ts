// SortOrder -----------------------------------------------------------------

// Standard "order" values for each defined Model

// External Modules ----------------------------------------------------------

import { Order } from "sequelize";

// Public Objects ------------------------------------------------------------

export const AUTHORS: Order  = [
    [ "library_id", "ASC" ],
    [ "last_name", "ASC" ],
    [ "first_name", "ASC" ],
];

export const LIBRARIES: Order = [
    [ "name", "ASC" ],
];

export const STORIES: Order = [
    [ "library_d", "ASC" ],
    [ "name", "ASC" ],
];

