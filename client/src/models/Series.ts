// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Story from "./Story";
import {toAuthors, toStories} from "../util/to-model-types";

// Public Objects ------------------------------------------------------------

class Series {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright;
        this.library_id = data.library_id;
        this.name = data.name;
        this.notes = data.notes;
        this.authors = data.authors ? toAuthors(data.authors) : [];
        this.stories = data.stories ? toStories(data.stories) : [];
    }

    id: number;
    active: boolean;
    copyright: string;
    library_id: number;
    name: string;
    notes: string;
    authors: Author[];
    stories: Story[];
}

export default Series;
