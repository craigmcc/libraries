// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

class Library {

    constructor(data: any = {}) {
        this.active = (data.active !== undefined) ? data.active : true;
        this.id = data.id || -1;
        this.name = data.name;
        this.notes = data.notes || null;
        this.scope = data.scope;
    }

    active!: boolean;
    id!: number;
    name!: string;
    notes?: string;
    scope!: string;

}

export default Library;
