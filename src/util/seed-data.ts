// Seed ----------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
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

// ***** Libraries *****

export const librariesData = [
    {
        "name": "First Seed Library",
        "scope": "first",
    },
    {
        "name": "Second Seed Library",
        "scope": "second",
    },
];

// ***** Stories *****

// For "First Seed" Library and Author (ids to be interpolated)
export const storiesFirst = [
    {
        "name": "My Story",
        "notes": "By Fred Flintstone",
    },
    {
        "name": "My Story", // Deliberate duplication
        "notes": "By Wilma Flintstone",
    },
    {
        "name": "Our Story",
        "notes": "By Fred Flintstone and Wilma Flintstone",
    },
];

// For "Second Seed" Library and Author (ids to be interpolated)
export const storiesSecond = [
    {
        "name": "My Story",
        "notes": "By Barney Rubble",
    },
    {
        "name": "My Story", // Deliberate duplication
        "notes": "By Betty Rubble",
    },
    {
        "name": "Our Story",
        "notes": "By Barney Rubble and Betty Rubble",
    },
];

export const oauthUsers = [
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
        password: "firstadmin",
        scope: "first admin regular",
        username: "firstadmin",
    },
    {
        active: true,
        name: "First Library Regular",
        password: "firstregular",
        scope: "first regular",
        username: "firstregular",
    },
    {
        active: true,
        name: "Second Library Admin",
        password: "secondadmin",
        scope: "second admin regular",
        username: "secondadmin",
    },
    {
        active: true,
        name: "Second Library Regular",
        password: "secondregular",
        scope: "second regular",
        username: "secondregular",
    },
]

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

