// types ---------------------------------------------------------------------

// Typescript type definitions for client application components.

// External Modules ----------------------------------------------------------

import React from "react";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";

// Model Object Handlers -----------------------------------------------------

export type HandleAuthor = (author: Author) => void;
export type HandleAuthorOptional = (author: Author | null) => void;
export type HandleLibrary = (library: Library) => void;
export type HandleLibraryOptional = (library: Library | null) => void;
export type HandleSeries = (series: Series) => void;
export type HandleSeriesOptional = (series: Series | null) => void;
export type HandleStory = (story: Story) => void;
export type HandleStoryOptional = (story: Story | null) => void;
export type HandleUser = (user: User) => void;
export type HandleUserOptional = (user: User | null) => void;
export type HandleVolume = (volume: Volume) => void;
export type HandleVolumeOptional = (volume: Volume | null) => void;

// HTML Event Handlers -------------------------------------------------------

export type OnAction = () => void; // Nothing to pass, just trigger action
export type OnBlur = (event: React.FocusEvent<HTMLElement>) => void;
export type OnChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => void;
export type OnChangeSelect = (event: React.ChangeEvent<HTMLSelectElement>) => void;
export type OnChangeTextArea = (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
export type OnClick = (event: React.MouseEvent<HTMLElement>) => void;
export type OnFocus = (event: React.FocusEvent<HTMLElement>) => void;
export type OnKeyDown = (event: React.KeyboardEvent<HTMLElement>) => void;

// Miscellaneous Handlers ----------------------------------------------------

export type HandleAction = () => void; // Synonym for OnAction
export type HandleBoolean = (newBoolean: boolean) => void;
export type HandleIndex = (newIndex: number) => void;
export type HandleValue = (newValue: string) => void;

// Enumerations --------------------------------------------------------------

export enum Levels {
    TRACE = "trace",
    DEBUG = "debug",
    INFO = "info",
    WARN = "warn",
    ERROR = "error",
    FATAL = "fatal",
}

export enum Scopes {
    ADMIN = "admin",
    ANY = "any",
    REGULAR = "regular",
    SUPERUSER = "superuser",
}
