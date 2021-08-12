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

export const AUTHORS = (authors: Author[]): any => {
    const results: Author[] = [];
    authors.forEach(author => {
        results.push(AUTHOR(author));
    });
    return results;
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

export const SERIESES = (serieses: Series[]): any => {
    const results: Series[] = [];
    serieses.forEach(series => {
        results.push(SERIES(series));
    });
    return results;
}

export const STORY = (story: Story): any => {
    return {
        id: story.id,
        library_id: story.library_id,
        name: story.name,
    }
}

export const STORIES = (stories: Story[]): any => {
    const results: Story[] = [];
    stories.forEach(story => {
        results.push(STORY(story));
    });
    return results;
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

export const VOLUMES = (volumes: Volume[]): any => {
    const results: Volume[] = [];
    volumes.forEach(volume => {
        results.push(VOLUME(volume));
    });
    return results;
}

