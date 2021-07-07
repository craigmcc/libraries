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
        this.ordinal = this.calculateOrdinal(data);
        this.authors = data.authors ? toAuthors(data.authors) : [];
    }

    id: number;
    active: boolean;
    copyright: string;
    library_id: number;
    name: string;
    notes: string;
    ordinal: number | null;
    authors: Author[];

    private calculateOrdinal(data: any): number | null {
        if (data.ordinal) {
            return data.ordinal;
        } else if (data.SeriesStory && data.SeriesStory.ordinal) {
            return data.SeriesStory.ordinal;
        } else {
            return null;
        }
    }

}

export default Story;
