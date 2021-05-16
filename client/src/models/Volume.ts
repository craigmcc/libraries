// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Story from "./Story";
import {toAuthors, toStories} from "../util/to-model-types";

// Public Objects ------------------------------------------------------------

class Volume {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright;
        this.google_id = data.google_id;
        this.isbn = data.isbn;
        this.library_id = data.library_id;
        this.location = data.location;
        this.name = data.name;
        this.notes = data.notes;
        this.read = (data.active !== undefined) ? data.read : false;
        this.type = data.type;
        this.authors = data.authors ? toAuthors(data.authors) : [];
        this.stories = data.stories ? toStories(data.stories) : [];
    }

    active: boolean;
    authors: Author[];
    copyright: string;
    google_id: string;
    id: number;
    isbn: string;
    library_id: number;
    location: string;
    name: string;
    notes: string;
    read: boolean;
    stories: Story[];
    type: string;
}

export default Volume;
