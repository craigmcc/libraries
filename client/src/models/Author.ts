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
        this.principal = this.calculatePrincipal(data);
    }

    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    library_id: number;
    notes: string;
    principal: boolean;

    private calculatePrincipal(data: any): boolean {
        if (data.principal !== undefined) {
            return data.principal;
        } else if (data.AuthorSeries && (data.AuthorSeries.principal !== undefined)) {
            return data.AuthorSeries.principal;
        } else if (data.AuthorStory && (data.AuthorStory.principal !== undefined)) {
            return data.AuthorStory.principal;
        } else if (data.AuthorVolume && (data.AuthorVolume.principal !== undefined)) {
            return data.AuthorVolume.principal;
        } else {
            return false;
        }
    }

}

export default Author;
