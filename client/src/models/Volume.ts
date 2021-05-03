// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Volume {

    constructor(data: any = {}) {
        this.active = (data.active !== undefined) ? data.active : true;
        this.copyright = data.copyright;
        this.google_id = data.google_id;
        this.id = data.id || -1;
        this.isbn = data.isbn;
        this.library_id = data.library_id;
        this.location = data.location;
        this.name = data.name;
        this.notes = data.notes;
        this.read = (data.active !== undefined) ? data.read : false;
        this.type = data.type;
    }

    active: boolean;
    copyright: string;
    google_id: string;
    id: number;
    isbn: string;
    library_id: number;
    location: string;
    name: string;
    notes: string;
    read: boolean;
    type: string;
}

export default Volume;
