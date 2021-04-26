// LibrariesSubview ----------------------------------------------------------

// Render a list of  Libraries, with a callback handler when a particular
// Library is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import {HandleIndex, HandleLibraryOptional} from "../components/types";
import LoginContext from "../contexts/LoginContext";
import Library from "../models/Library";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {listValue} from "../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleLibraryOptional;// Handle Library selection or deselection
    title?: string;                     // Table title [Application Libraries]
}

// Component Details ---------------------------------------------------------

const LibrariesSubview = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [index, setIndex] = useState<number>(-1);
    const [libraries, setLibraries] = useState<Library[]>([]);

    useEffect(() => {

        const fetchLibraries = async () => {
            if (loginContext.state.loggedIn) {
                try {
                    const newLibraries: Library[] = await LibraryClient.all();
                    setIndex(-1);
                    setLibraries(newLibraries);
                    logger.debug({
                        context: "LibrariesSubview.fetchLibraries",
                        count: newLibraries.length,
                        libraries: newLibraries,
                    });

                } catch (error) {
                    setIndex(-1);
                    setLibraries([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "LibrariesSubview.fetchLibraries",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("LibrariesSubview.fetchLibraries", error);
                    }
                }
            } else {
                setIndex(-1);
                setLibraries([]);
                logger.debug({
                    context: "LibrariesSubview.fetchLibraries",
                    msg: "SKIPPED",
                });
            }
        }

        fetchLibraries();

    }, [loginContext]);

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "LibrariesSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newLibrary = libraries[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "LibrariesSubview.handleIndex",
                index: newIndex,
                library: Abridgers.LIBRARY(newLibrary),
            });
            if (props.handleSelect) {
                props.handleSelect(newLibrary);
            }
        }
    }

    return (

        <Container fluid id="LibrariesSubview">

            <Table
                bordered={true}
                hover={true}
                size="sm"
                striped={true}
            >

                <thead>
                <tr className="table-dark">
                    <th
                        className="text-center"
                        colSpan={4}
                        key={101}
                    >
                        {props.title ? props.title : "Application Libraries"}
                    </th>
                </tr>
                <tr className="table-secondary">
                    <th scope="col>">Name</th>
                    <th scope="col">Active</th>
                    <th scope="col">Notes</th>
                    <th scope="col">Scope</th>
                </tr>
                </thead>

                <tbody>
                {libraries.map((library, rowIndex) => (
                    <tr
                        className={"table-" +
                            (rowIndex === index ? "primary" : "default")}
                        key={1000 + (rowIndex * 100)}
                        onClick={() => (handleIndex(rowIndex))}
                    >
                        <td key={1000 + (rowIndex * 100) + 1}>
                            {library.name}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 2}>
                            {listValue(library.active)}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 3}>
                            {library.notes}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 4}>
                            {library.scope}
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>

        </Container>

    )

}

export default LibrariesSubview;
