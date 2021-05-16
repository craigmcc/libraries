// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Series {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright;
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

export default Series;
