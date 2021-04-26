// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Story {

    constructor(data: any = {}) {
        this.active = data.active || true;
        this.copyright = data.copyright;
        this.id = data.id || -1;
        this.library_id = data.library_id;
        this.name = data.name;
        this.notes = data.notes;
    }

    active: boolean;
    copyright: string;
    id: number;
    library_id: number;
    name: string;
    notes: string;
}

export default Story;
