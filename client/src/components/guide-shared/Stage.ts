// Stage ---------------------------------------------------------------------

// Staging enumeration for guided processes for Series and Volume stacks.

// Public Objects ------------------------------------------------------------

export enum Stage {
    PARENT,
    AUTHORS,
    STORIES,
    WRITERS,
    SERIES,
    VOLUMES,
}

export type HandleStage = (newStage: Stage) => void;
