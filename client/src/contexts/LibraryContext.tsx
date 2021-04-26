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
import {HandleLibraryOptional, OnAction} from "../components/types";

// Context Properties --------------------------------------------------------

export type LibraryContextState = {
    libraries: Library[];               // Libraries visible to this User
    library: Library;                   // Currently selected Library or dummy
}

export type LibraryContextData = {
    state: LibraryContextState;
    doRefresh: OnAction;                // Request a refresh of active Libraries
    doSelect: HandleLibraryOptional;    // Select new current library
}

const DUMMY_LIBRARY: Library = {
    id: -1,
    active: false,
    name: "(Please Select)",
    notes: "",
    scope: "",
};

const DUMMY_STATE: LibraryContextState = {
    libraries: [],
    library: DUMMY_LIBRARY,
}

export const LibraryContext = createContext<LibraryContextData>({
    state: DUMMY_STATE,
    doRefresh: (): void => {},
    doSelect: (library: Library | null): void => {},
});

export default LibraryContext;

// Context Provider ----------------------------------------------------------

export const LibraryContextProvider = (props: any) => {

    const loginContext = useContext(LoginContext);

    const [refresh, setRefresh] = useState<boolean>(false);
    const [state, setState] = useState<LibraryContextState>(DUMMY_STATE);

    useEffect(() => {

        const fetchLibraries = async () => {
            setRefresh(false);
            try {
                if (loginContext.state.loggedIn) {
                    const newLibraries: Library[] = [];
                    // Select active Libraries visible to the logged in User
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
                        libraries: newLibraries,
                    });
                    setState({
                        libraries: newLibraries,
                        library: (newLibraries.length > 0) ? newLibraries[0] : DUMMY_LIBRARY,
                    });
                } else {
                    logger.info({
                        context: "LibraryContext.fetchLibraries",
                        msg: "SKIPPED",
                    });
                    setState({
                        libraries: [],
                        library: DUMMY_LIBRARY,
                    })
                }
            } catch (error) {
                ReportError("LibraryContext.fetchLibraries", error);
                setState({
                    libraries: [],
                    library: DUMMY_LIBRARY,
                })
            }
        }

        fetchLibraries();

    }, [loginContext, refresh]);

    const doRefresh: OnAction = () => {
        logger.info({
            context: "LibraryContext.doRefresh",
            msg: "Triggering refresh of active Libraries",
        });
        setRefresh(true);
    }

    const doSelect: HandleLibraryOptional = (newLibrary) => {
        logger.info({
            context: "LibraryContext.doSelect",
            library: newLibrary,
        });
        const newState = {
            ...state,
            library: newLibrary ? newLibrary : DUMMY_LIBRARY,
        };
        setState(newState);
    }

    const libraryContext: LibraryContextData = {
        state: state,
        doRefresh: doRefresh,
        doSelect: doSelect,
    }

    return (
        <LibraryContext.Provider value={libraryContext}>
            {props.children};
        </LibraryContext.Provider>
    )

}
