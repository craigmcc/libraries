// LibrarySelector -----------------------------------------------------------

// Selector drop-down to choose which Library the user wants to interact with.
// The options are populated from LibraryContext, and the currently selected
// one is stored there when it changes.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import {HandleLibraryOptional, OnChangeSelect} from "./types";
import LibraryContext from "../contexts/LibraryContext";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    autoFocus?: boolean;            // Should element receive autoFocus? [false]
    disabled?: boolean;             // Should element be disabled? [false]
    handleLibrary?: HandleLibraryOptional;  // Handle change of selected library
    label?: string;                 // Element label [Library:]
}

// Component Details ---------------------------------------------------------

export const LibrarySelector = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [index, setIndex] = useState<number>(-1);

    useEffect(() => {
        let newIndex: number;
        if (libraryContext.state.libraries.length > 0) {
            newIndex = 0;
        } else {
            newIndex = -1;
        }
        logger.debug({
            context: "LibrarySelector.useEffect",
            index: newIndex,
        });
        setIndex(newIndex);
    }, [libraryContext.state.libraries]);

    const onChange: OnChangeSelect = (event) => {
        const newIndex: number = parseInt(event.target.value);
        const newLibrary = (newIndex >= 0) ? libraryContext.state.libraries[newIndex] : null;
        logger.debug({
            context: "LibrarySelector.onChange",
            index: newIndex,
            library: newLibrary,
        })
        if (props.handleLibrary) {
            props.handleLibrary(newLibrary);
        }
        libraryContext.doSelect(newLibrary);
        setIndex(newIndex);
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
                    {libraryContext.state.libraries.map((library, index) => (
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
