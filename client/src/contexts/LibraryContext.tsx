// LibraryContext ------------------------------------------------------------

// Context containing the currently available Libraries that are visible to
// the logged in user, as well as an ability to update the list or select a
// newly desired Library.

// External Modules ----------------------------------------------------------

import React, {createContext, useContext, useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LoginContext from "./LoginContext";
import LibraryClient from "../clients/LibraryClient";
import Library from "../models/Library";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {HandleIndex} from "../components/types";

// Context Properties --------------------------------------------------------

export type LibraryContextState = {
    index: number;                      // Index to currently selected Library
    libraries: Library[];               // Libraries visible to this User
    library: Library;                   // Currently selected Library or dummy
}

export type LibraryContextData = {
    state: LibraryContextState;
    doSelect: HandleIndex;              // Select new current library
}

const DUMMY_LIBRARY: Library = {
    id: -1,
    active: false,
    name: "(Please Select)",
    notes: "",
    scope: "",
};

const DUMMY_STATE: LibraryContextState = {
    index: -1,
    libraries: [],
    library: DUMMY_LIBRARY,
}

export const LibraryContext = createContext<LibraryContextData>({
    state: DUMMY_STATE,
    doSelect: (newIndex: number): void => {},
});

export default LibraryContext;

// Context Provider ----------------------------------------------------------

export const LibraryContextProvider = (props: any) => {

    const loginContext = useContext(LoginContext);

    const [state, setState] = useState<LibraryContextState>(DUMMY_STATE);

    useEffect(() => {

        const fetchLibraries = async () => {
            try {
                const newLibraries: Library[] = [];
                if (loginContext.state.loggedIn) {
                    const activeLibraries: Library[] = await LibraryClient.active();
                    activeLibraries.forEach(activeLibrary => {
                        if (loginContext.validateScope(activeLibrary.scope)) {
                            newLibraries.push(activeLibrary);
                        }
                    })
                    logger.info({
                        context: "LibraryContext.fetchLibraries",
                        countAvailable: newLibraries.length,
                        countActive: activeLibraries.length,
//                        libraries: newLibraries,
                    });
                } else {
                    logger.info({
                        context: "LibraryContext.fetchLibraries",
                        msg: "SKIPPED",
                    });
                }
                setState({
                    index: newLibraries.length > 0 ? 0 : -1,
                    libraries: newLibraries,
                    library: newLibraries.length > 0 ? newLibraries[0] : DUMMY_LIBRARY
                });
            } catch (error) {
                ReportError("LibraryContext.fetchLibraries", error);
                setState({
                    index: -1,
                    libraries: [],
                    library: DUMMY_LIBRARY,
                })
            }
        }

        fetchLibraries();

    }, [loginContext]);

    const doSelect: HandleIndex = (newIndex: number) => {
        const newState = state;
        if ((newIndex >= 0) && (newIndex < state.libraries.length)) {
            newState.index = newIndex;
            newState.library = newState.libraries[newIndex];
        } else {
            newState.index = -1;
            newState.library = DUMMY_LIBRARY
        }
        logger.info({
            context: "LibraryContext.doSelect",
            index: newState.index,
            library: newState.library,
        });
        setState(newState);
    }

    const libraryContext: LibraryContextData = {
        state: state,
        doSelect: doSelect
    }

    return (
        <LibraryContext.Provider value={libraryContext}>
            {props.children};
        </LibraryContext.Provider>
    )

}
