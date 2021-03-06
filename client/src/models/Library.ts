// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Library {

    constructor(data: any = {}) {
        this.id = data.id || -1;
        this.active = (data.active !== undefined) ? data.active : true;
        this.name = data.name;
        this.notes = data.notes || null;
        this.scope = data.scope;
    }

    id!: number;
    active!: boolean;
    name!: string;
    notes?: string;
    scope!: string;

}

export default Library;
