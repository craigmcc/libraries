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
import {HandleLibrary} from "../components/types";

// Context Properties --------------------------------------------------------

export type LibraryContextData = {
    libraries: Library[];               // Libraries visible to this user
    library: Library;                   // Currently selected library (or dummy)
    doSelect: HandleLibrary;            // Select new current library
}

const DUMMY_LIBRARY: Library = {
    id: -1,
    active: false,
    name: "(Please Select)",
    notes: "",
    scope: "",
};

export const LibraryContext = createContext<LibraryContextData>({
    libraries: [],
    library: DUMMY_LIBRARY,
    doSelect: (library: Library): void => {},
});

export default LibraryContext;

// Context Provider ----------------------------------------------------------

export const LibraryContextProvider = (props: any) => {

    const loginContext = useContext(LoginContext);

    const [libraries, setLibraries] = useState<Library[]>([]);
    const [library, setLibrary] = useState<Library>(DUMMY_LIBRARY);

    useEffect(() => {

        const fetchLibraries = async () => {
            try {
                const newLibraries: Library[] = [];
                if (loginContext.loggedIn) {
                    const activeLibraries: Library[] = await LibraryClient.active();
                    activeLibraries.forEach(activeLibrary => {
                        if (loginContext.validateScope(activeLibrary.scope)) {
                            newLibraries.push(activeLibrary);
                        }
                    })
                    logger.info({               // TODO - debug
                        context: "LibraryContext.fetchLibraries",
                        countAvailable: newLibraries.length,
                        countActive: activeLibraries.length,
                        libraries: newLibraries,
                    });
                } else {
                    logger.info({               // TODO - debug
                        context: "LibraryContext.fetchLibraries",
                        msg: "SKIPPED",
                    });
                }
                setLibraries(newLibraries);
                if (newLibraries.length > 0) {
                    setLibrary(newLibraries[0]);
                } else {
                    setLibrary(DUMMY_LIBRARY);
                }
            } catch (error) {
                ReportError("LibraryContext.fetchLibraries", error);
                setLibraries([]);
                setLibrary(DUMMY_LIBRARY);
            }
        }

        fetchLibraries();

    }, [loginContext]);

    const doSelect: HandleLibrary = (newLibrary: Library) => {
        logger.info({
            context: "LibraryContext.doSelect",
            msg: `Checking id ${newLibrary.id} against ${JSON.stringify(libraries)}`
        });
        let found = false;
        libraries.forEach(library => {
            if (library.id === newLibrary.id) {
                setLibrary(newLibrary);
                found = true;
            }
        })
        if (!found) {
            logger.warn({
                context: "LibraryContext.doSelect",
                msg: `Skipped invalid newLibrary.id ${newLibrary.id}`
            });
        }
    }

    const libraryContext: LibraryContextData = {
        libraries: libraries,
        library: library,
        doSelect: doSelect
    }

    return (
        <LibraryContext.Provider value={libraryContext}>
            {props.children};
        </LibraryContext.Provider>
    )

}
