// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

export interface Story {
    id: number;
    active: boolean;
    copyright: string;
    library_id: number;
    name: string;
    notes: string;
}

export default Story;
