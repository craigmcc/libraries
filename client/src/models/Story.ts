// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import {toAuthors} from "../util/to-model-types";

// Public Objects ------------------------------------------------------------


class Story {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright;
        this.library_id = data.library_id;
        this.name = data.name;
        this.notes = data.notes;
        this.authors = data.authors ? toAuthors(data.authors) : [];
    }

    id: number;
    active: boolean;
    copyright: string;
    library_id: number;
    name: string;
    notes: string;
    authors: Author[];
}

export default Story;
