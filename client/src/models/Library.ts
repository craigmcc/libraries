// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface Library {
    id: number;
    active: boolean;
    name: string;
    notes: string;
    scope: string;
}

export default Library;
