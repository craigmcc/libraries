// Abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const ANY = (model: Author | Library | Series | Story | User | Volume) => {
    if (model instanceof Author) {
        return AUTHOR(model);
    } else if (model instanceof Library) {
        return LIBRARY(model);
    } else if (model instanceof Series) {
        return SERIES(model);
    } else if (model instanceof Story) {
        return STORY(model);
    } else if (model instanceof User) {
        return USER(model);
    } else if (model instanceof Volume) {
        return VOLUME(model);
    } else {
        return {
            model: typeof model,
        }
    }
}

export const AUTHOR = (author: Author): object => {
    return {
        id: author.id,
        libraryId: author.libraryId,
        firstName: author.firstName,
        lastName: author.lastName,
    }
}

export const LIBRARY = (library: Library): object => {
    return {
        id: library.id,
        name: library.name,
    }
}

export const SERIES = (series: Series): object => {
    return {
        id: series.id,
        libraryId: series.libraryId,
        name: series.name,
    }
}

export const STORY = (story: Story): object => {
    return {
        id: story.id,
        libraryId: story.libraryId,
        name: story.name,
    }
}

export const USER = (user: User): object => {
    return {
        id: user.id,
        scope: user.scope,
        username: user.username,
    }
}

export const VOLUME = (volume: Volume): object => {
    return {
        id: volume.id,
        libraryId: volume.libraryId,
        name: volume.name,
    }
}

