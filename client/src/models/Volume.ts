// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface Volume {
    id: number;
    active: boolean;
    copyright: string;
    google_id: string;
    isbn: string;
    library_id: number;
    location: string;
    media: string;
    name: string;
    notes: string;
    read: boolean;
}

export default Volume;
