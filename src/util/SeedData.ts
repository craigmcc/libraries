// SeedData ------------------------------------------------------------------

// Seed data for tests.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AccessToken from "../models/AccessToken";
import Author from "../models/Author";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Seed Data -----------------------------------------------------------------

// ***** Libraries *****

export const FIRST_LIBRARY = "Test Library";
export const SECOND_LIBRARY = "Extra Library";

// NOTE: Tests never touch any libraries except these!!!
export const LIBRARIES: Partial<Library>[] = [
    {
        name: FIRST_LIBRARY,
        scope: "test1",
    },
    {
        name: SECOND_LIBRARY,
        scope: "test2",
    },
];

// *** Access Tokens ***

const ONE_DAY = 24 * 60 * 60 * 1000;    // One day (milliseconds)

export const ACCESS_TOKENS_SUPERUSER: Partial<AccessToken>[] = [
    {
        expires: new Date(new Date().getTime() + ONE_DAY),
        scope: "superuser",
        token: "superuser_access_1",
        // userId must be seeded
    },
    {
        expires: new Date(new Date().getTime() - ONE_DAY),
        scope: "superuser",
        token: "superuser_access_2",
        // userId must be seeded
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

// *** Refresh Tokens ***

export const REFRESH_TOKENS_SUPERUSER: Partial<RefreshToken>[] = [
    {
        accessToken: "superuser_access_1",
        expires: new Date(new Date().getTime() + ONE_DAY),
        token: "superuser_refresh_1",
        // userId must be seeded
    },
    {
        accessToken: "superuser_access_2",
        expires: new Date(new Date().getTime() - ONE_DAY),
        token: "superuser_refresh_2",
        // userId must be seeded
    },
];

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

// ***** Users *****

export const USER_USERNAME_SUPERUSER = "superuser";
export const USER_USERNAME_FIRST_ADMIN = "firstadmin";
export const USER_USERNAME_FIRST_REGULAR = "firstregular";
export const USER_USERNAME_SECOND_ADMIN = "secondadmin";
export const USER_USERNAME_SECOND_REGULAR = "secondregular";

export const USERS: Partial<User>[] = [
    {
        active: true,
        scope: "first:admin",
        username: USER_USERNAME_FIRST_ADMIN,
    },
    {
        active: true,
        scope: "first:regular",
        username: USER_USERNAME_FIRST_REGULAR,
    },
    {
        active: false,
        scope: "second:admin",
        username: USER_USERNAME_SECOND_ADMIN,
    },
    {
        active: false,
        scope: "second:regular",
        username: USER_USERNAME_SECOND_REGULAR,
    },
    {
        active: true,
        scope: "superuser",
        username: USER_USERNAME_SUPERUSER,
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

