// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
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
        scope: "test",
    },
];

// ***** Authors *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY0: Partial<Author>[] = [
    {
        firstName: "Fred",
        lastName: "Flintstone",
    },
    {
        firstName: "Wilma",
        lastName: "Flintstone",
    },
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const AUTHORS_LIBRARY1: Partial<Author>[] = [
    {
        firstName: "Barney",
        lastName: "Rubble",
    },
    {
        firstName: "Betty",
        lastName: "Rubble",
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

// ***** Series *****

export const SERIES_LIBRARY0: Partial<Series>[] = [
    {
        name: "Flintstone Series",
    },
]

export const SERIES_LIBRARY1: Partial<Series>[] = [
    {
        name: "Rubble Series",
    },
]

// ***** Stories *****

// For FIRST_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY0: Partial<Story>[] = [
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

// For SECOND_LIBRARY (libraryId to be interpolated)
export const STORIES_LIBRARY1: Partial<Story>[] = [
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

// For FIRST_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY0: Partial<Volume>[] = [
    {
        "name": "Fred Volume",
        "type": "Single",
    },
    {
        "name": "Wilma Volume",
        "type": "Single",
    },
    {
        "name": "Flintstone Volume",
        "type": "Anthology",
    }
];

// For SECOND_LIBRARY (libraryId to be interpolated)
export const VOLUMES_LIBRARY1: Partial<Volume>[] = [
    {
        "name": "Barney Volume",
        "type": "Single",
    },
    {
        "name": "Betty Volume",
        "type": "Single",
    },
    {
        "name": "Rubble Volume",
        "type": "Anthology",
    }
];

