// StageAuthors --------------------------------------------------------------

// Select Author(s) for the currently selected Series/Story/Volume, while offering
// the option to edit existing Authors or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import AuthorOptions from "./AuthorOptions";
import {HandleStage, Stage} from "./Stage";
import {HandleAction, HandleAuthor, OnAction, Scopes} from "../types";
import AuthorForm from "../authors/AuthorForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    parent: Series | Story | Volume;    // Currently selected Series/Story/Volume
}

// Component Details ---------------------------------------------------------

const StageAuthors = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [author, setAuthor] = useState<Author | null>(null);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);

    const [{performExclude, performInclude, performInsert, performRemove,
        performUpdate/*, error, processing*/}] = useMutateAuthor({
            author: author,
            library: libraryContext.state.library,
            parent: props.parent,
        });

    useEffect(() => {

        logger.info({
            context: "StageAuthors.useEffect",
            parent: Abridgers.ANY(props.parent),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [loginContext, loginContext.state.loggedIn,
        libraryId, props.parent]);

    const handleAdd: OnAction = () => {
        const newAuthor = new Author({
            first_name: null,
            last_name: null,
            library_id: libraryId,
            notes: null,
            principal: true,
        });
        logger.debug({
            context: "StageAuthors.handleAdd",
            author: newAuthor,
        });
        setAuthor(newAuthor);
    }

    const handleEdit: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "StageAuthors.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
    }

    const handleExclude: HandleAuthor = async (theAuthor) => {
        await performExclude(theAuthor);
        props.handleRefresh();
    }

    const handleInclude: HandleAuthor = async (theAuthor) => {
        await performInclude(theAuthor);
        props.handleRefresh();
    }

    const handleInsert: HandleAuthor = async (theAuthor) => {
        const inserted = await performInsert(theAuthor);
        inserted.principal = theAuthor.principal; // Carry principal (if any) forward
        await performInclude(inserted); // Assume new author is included
        setAuthor(null);
        props.handleRefresh();
    }

    const handleRemove: HandleAuthor = async (theAuthor) => {
        await performRemove(theAuthor);
        setAuthor(null);
        props.handleRefresh();
    }

    const handleUpdate: HandleAuthor = async (theAuthor) => {
        await performUpdate(theAuthor);
        setAuthor(null);
        props.handleRefresh();
    }

    // Is the specified Author currently included for this Series/Story/Volume?
    const included = (author: Author): boolean => {
        let result = false;
        props.parent.authors.forEach(includedAuthor => {
            if (author.id === includedAuthor.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageAuthors">

            {/* List View */}
            {(!author) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={false}
                                onClick={() => props.handleStage(Stage.PARENT)}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            {(props.parent instanceof Series) ? (
                                <span>Manage Authors for Series:&nbsp;</span>
                            ) : (
                                <span>Manage Authors for Volume:&nbsp;</span>
                            )}
                            <span className="text-info">
                                {props.parent.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={props.parent.authors.length < 1}
                                onClick={() => props.handleStage(Stage.STORIES)}
                                size="sm"
                                variant={(props.parent.authors.length < 1) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <AuthorOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        included={included}
                        parent={props.parent}
                    />
                    <Button
                        className="mt-3 ml-1"
                        onClick={handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>

                </>
            ) : null}

            {/* Detail View */}
            {(author) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(author.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            {(props.parent instanceof Series) ? (
                                <span>Author for Series:&nbsp;</span>
                            ) : (
                                <span>Author for Volume:&nbsp;</span>
                            )}
                            <span className="text-info">
                                {props.parent.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setAuthor(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <AuthorForm
                        author={author}
                        autoFocus
                        canRemove={canRemove}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                    />

                </>
            ) : null}

        </Container>
    )

}

export default StageAuthors;
