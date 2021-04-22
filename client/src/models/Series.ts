// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface Series {
    id: number;
    active: boolean;
    copyright: string;
    library_id: number;
    name: string;
    notes: string;
}

export default Series;
