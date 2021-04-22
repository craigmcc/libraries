// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface Author {
    id: number;
    active: boolean;
    first_name: string;
    last_name: string;
    library_id: number;
    notes: string;
}

export default Author;

