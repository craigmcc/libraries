// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Author {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.first_name = data.first_name;
        this.last_name = data.last_name;
        this.library_id = data.library_id;
        this.notes = data.notes;
    }

    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    library_id: number;
    notes: string;

}

export default Author;
