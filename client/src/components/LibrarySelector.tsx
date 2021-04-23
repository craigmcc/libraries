// LibrarySelector -----------------------------------------------------------

// Selector drop-down to choose which Library the user wants to interact with.
// The options are populated from LibraryContext, and the currently selected
// one is stored there when it changes.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import { HandleLibrary, OnChangeSelect } from "./types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import Library from "../models/Library";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;            // Should element receive autoFocus? [false]
    disabled?: boolean;             // Should element be disabled? [false]
    handleLibrary?: HandleLibrary;  // Handle (library) selection [No handler]
    label?: string;                 // Element label [Library:]
}

// Component Details ---------------------------------------------------------

export const LibrarySelector = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const calculateIndex = () : number => {
        let result = -1;
        libraryContext.libraries.forEach((library, index) => {
            if (library.id === libraryContext.library.id) {
                result = index;
            }
        });
        return result;
    }
    const [index, setIndex] = useState<number>(calculateIndex());

    useEffect(() => {
        if (!loginContext.loggedIn) {
            setIndex(-1);
        }
        // TODO - cause a re-render on any change in either context
    }, [libraryContext, loginContext]);

    const onChange: OnChangeSelect = (event) => {
        const newIndex: number = parseInt(event.target.value);
        const newLibrary: Library = (newIndex > 0)
            ? libraryContext.libraries[newIndex]
            : { active: false, id: -1, name: "Unselected", notes: "", scope: "unselected" };
        libraryContext.doSelect(libraryContext.libraries[newIndex]);
        logger.trace({
            context: "LibrarySelector.onChange",
            index: newIndex,
            library: Abridgers.LIBRARY(newLibrary),
        });
        if ((newIndex >= 0) && props.handleLibrary) {
            setIndex(newIndex);
            props.handleLibrary(newLibrary);
        }
    }

    return (

        <>
            <Form inline>
                <Form.Label  className="mr-2" htmlFor="librarySelector">
                    {props.label ? props.label : "Library:"}
                </Form.Label>
                <Form.Control
                    as="select"
                    autoFocus={props.autoFocus ? props.autoFocus : undefined}
                    disabled={props.disabled ? props.disabled : undefined}
                    id="librarySelector"
                    onChange={onChange}
                    size="sm"
                    value={index}
                >
                    <option key="-1" value="-1">(Select)</option>
                    {libraryContext.libraries.map((library, index) => (
                        <option key={index} value={index}>
                            {library.name}
                        </option>
                    ))}
                </Form.Control>
            </Form>
        </>

    )

}

export default LibrarySelector;
