// abridgers -----------------------------------------------------------------

// Return abridged versions of model objects for use in log events.

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import User from "../models/User";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const AUTHOR = (author: Author): any => {
    return {
        id: author.id,
        first_name: author.first_name,
        last_name: author.last_name,
        library_id: author.library_id,
    }
}

export const LIBRARY = (library: Library): any => {
    return {
        id: library.id,
        name: library.name,
    }
}

export const SERIES = (series: Series): any => {
    return {
        id: series.id,
        library_id: series.library_id,
        name: series.name,
    }
}

export const STORY = (story: Story): any => {
    return {
        id: story.id,
        library_id: story.library_id,
        name: story.name,
    }
}

export const USER = (user: User): any => {
    return {
        id: user.id,
        username: user.username,
    }
}

export const VOLUME = (volume: Volume): any => {
    return {
        id: volume.id,
        library_id: volume.library_id,
        name: volume.name,
    }
}
