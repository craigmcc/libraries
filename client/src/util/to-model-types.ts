// to-model-types ------------------------------------------------------------

// Convert arbitrary objects or arrays to specified Model objects.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";

// Public Objects ------------------------------------------------------------

export const toAuthor = (value: any): Author => {
    return new Author(value);
}

export const toAuthors = (values: any | undefined): Author[] => {
    const results: Author[] = [];
    if (values && values.length) {
        // @ts-ignore
        values.forEach(value => {
            results.push(new Author(value));
        })
    }
    return results;
}

export const toLibrary = (value: any): Library => {
    return new Library(value);
}

export const toLibraries = (values: any | undefined): Library[] => {
    const results: Library[] = [];
    if (values && values.length) {
        // @ts-ignore
        values.forEach(value => {
            results.push(new Library(value));
        })
    }
    return results;
}

export const toSeries = (value: any): Series => {
    return new Series(value);
}

export const toSerieses = (values: any | undefined): Series[] => {
    const results: Series[] = [];
    if (values && values.length) {
        // @ts-ignore
        values.forEach(value => {
            results.push(new Series(value));
        })
    }
    return results;
}

export const toStory = (value: any): Story => {
    return new Story(value);
}

export const toStories = (values: any | undefined): Story[] => {
    const results: Story[] = [];
    if (values && values.length) {
        // @ts-ignore
        values.forEach(value => {
            results.push(new Story(value));
        })
    }
    return results;
}

export const toVolume = (value: any): Volume => {
    return new Volume(value);
}

export const toVolumes = (values: any | undefined): Volume[] => {
    const results: Volume[] = [];
    if (values && values.length) {
        // @ts-ignore
        values.forEach(value => {
            results.push(new Volume(value));
        })
    }
    return results;
}

