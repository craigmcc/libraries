// AuthorsSubview ------------------------------------------------------------

// Render a list of Authors for the currently selected Author, with a callback
// handler when a particular Author is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import {HandleIndex, HandleAuthorOptional} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import Author from "../models/Author";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {listValue} from "../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleAuthorOptional; // Handle Author selection or deselection
    title?: string;                     // Table title [Authors for Library XXXXX]
}

// Component Details ---------------------------------------------------------

const AuthorsSubview = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [index, setIndex] = useState<number>(-1);
    const [authors, setAuthors] = useState<Author[]>([]);

    useEffect(() => {

        // TODO - search bar and pagination
        const fetchAuthors = async () => {
            if (loginContext.state.loggedIn) {
                try {
                    const newAuthors: Author[]
                        = await AuthorClient.all(libraryContext.state.library.id);
                    setIndex(-1);
                    setAuthors(newAuthors);
                    logger.debug({
                        context: "AuthorsSubview.fetchAuthors",
                        count: newAuthors.length,
//                        authors: newAuthors,
                    });

                } catch (error) {
                    setIndex(-1);
                    setAuthors([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "AuthorsSubview.fetchAuthors",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("AuthorsSubview.fetchAuthors", error);
                    }
                }
            } else {
                setIndex(-1);
                setAuthors([]);
                logger.debug({
                    context: "AuthorsSubview.fetchAuthors",
                    msg: "SKIPPED",
                });
            }
        }

        fetchAuthors();

    }, [libraryContext, loginContext]);

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "AuthorsSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newAuthor = authors[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "AuthorsSubview.handleIndex",
                index: newIndex,
                author: Abridgers.AUTHOR(newAuthor),
            });
            if (props.handleSelect) {
                props.handleSelect(newAuthor);
            }
        }
    }

    return (

        <Container fluid id="AuthorsSubview">

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
                        {props.title ? props.title : `Authors for ${libraryContext.state.library.name}`}
                    </th>
                </tr>
                <tr className="table-secondary">
                    <th scope="col">First Name</th>
                    <th scope="col">Last Name</th>
                    <th scope="col">Active</th>
                    <th scope="col">Notes</th>
                </tr>
                </thead>

                <tbody>
                {authors.map((author, rowIndex) => (
                    <tr
                        className={"table-" +
                        (rowIndex === index ? "primary" : "default")}
                        key={1000 + (rowIndex * 100)}
                        onClick={() => (handleIndex(rowIndex))}
                    >
                        <td key={1000 + (rowIndex * 100) + 1}>
                            {author.first_name}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 2}>
                            {author.last_name}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 3}>
                            {listValue(author.active)}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 4}>
                            {author.notes}
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>

        </Container>

    )

}

export default AuthorsSubview;
