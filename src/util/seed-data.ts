// seed-data -----------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Story from "../models/Story";
import Volume from "../models/Volume";

// Seed Data -----------------------------------------------------------------

// ***** Libraries *****

export const FIRST_LIBRARY = "Test Library";
export const SECOND_LIBRARY = "Extra Library";

// NOTE: Tests never touch any libraries except these!!!
export const LIBRARIES: Partial<Library>[] = [
    {
        name: FIRST_LIBRARY,
        scope: "test",
    },
    {
        name: SECOND_LIBRARY,
        scope: "extra",
    },
];

// ***** Authors *****

// For FIRST_LIBRARY (library_id to be interpolated)
export const AUTHORS_FIRST_LIBRARY: Partial<Author>[] = [
    {
        "first_name": "Fred",
        "last_name": "Flintstone",
    },
    {
        "first_name": "Wilma",
        "last_name": "Flintstone",
    },
];

// For SECOND_LIBRARY (library_id to be interpolated)
export const AUTHORS_SECOND_LIBRARY: Partial<Author>[] = [
    {
        "first_name": "Barney",
        "last_name": "Rubble",
    },
    {
        "first_name": "Betty",
        "last_name": "Rubble",
    },
];

// OAuth Users (TODO - encrypt passwords)
export const OAUTH_USERS = [
    {
        active: true,
        name: "Superuser User",
        password: "superuser",
        scope: "superuser",
        username: "superuser",
    },
    {
        active: true,
        name: "First Library Admin",
        password: "testadmin",
        scope: "test admin regular",
        username: "testadmin",
    },
    {
        active: true,
        name: "First Library Regular",
        password: "testregular",
        scope: "test regular",
        username: "testregular",
    },
    {
        active: true,
        name: "Second Library Admin",
        password: "extraadmin",
        scope: "extra admin regular",
        username: "extraadmin",
    },
    {
        active: true,
        name: "Second Library Regular",
        password: "extraregular",
        scope: "extra regular",
        username: "extraregular",
    },
]

// ***** Stories *****

// For FIRST_LIBRARY (library_id to be interpolated)
export const STORIES_FIRST_LIBRARY: Partial<Story>[] = [
    {
        "name": "Fred Story",
    },
    {
        "name": "Wilma Story",
    },
    {
        "name": "Flintstone Story",
    }
];

// For SECOND_LIBRARY (library_id to be interpolated)
export const STORIES_SECOND_LIBRARY: Partial<Story>[] = [
    {
        "name": "Barney Story",
    },
    {
        "name": "Betty Story",
    },
    {
        "name": "Rubble Story",
    }
];

// ***** Volumes *****

// For FIRST_LIBRARY (library_id to be interpolated)
export const VOLUMES_FIRST_LIBRARY: Partial<Volume>[] = [
    {
        "name": "Fred Volume",
    },
    {
        "name": "Wilma Volume",
    },
    {
        "name": "Flintstone Volume",
    }
];

// For SECOND_LIBRARY (library_id to be interpolated)
export const VOLUMES_SECOND_LIBRARY: Partial<Volume>[] = [
    {
        "name": "Barney Volume",
    },
    {
        "name": "Betty Volume",
    },
    {
        "name": "Rubble Volume",
    }
];

