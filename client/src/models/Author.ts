// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Author {

    constructor(data: any = {}) {
        this.active = (data.active !== undefined) ? data.active : true;
        this.first_name = data.first_name;
        this.id = data.id || -1;
        this.last_name = data.last_name;
        this.library_id = data.library_id;
        this.notes = data.notes;
    }


    active: boolean;
    first_name: string;
    id: number;
    last_name: string;
    library_id: number;
    notes: string;
}

export default Author;
