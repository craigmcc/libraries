// StageAuthor ---------------------------------------------------------------

// Select the Author to process for subsequent stages, while offering the option
// to edit existing Authors or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleAuthor, OnAction, Scopes} from "../types";
import AuthorOptions from "./AuthorOptions"; // TODO - shared???
import {HandleStage, Stage} from "../guide-shared/Stage";
import AuthorForm from "../authors/AuthorForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    author: Author;                     // Currently selected Author (if id>0)
    handleAuthor: HandleAuthor;         // Handle request to select an Author
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
}

// Component Details ---------------------------------------------------------

const StageAuthor = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [author, setAuthor] = useState<Author | null>(null);

    const [{performInsert, performRemove, performUpdate/*, error, processing*/}]
        = useMutateAuthor({ // TODO error/processing
            author: author,
            library: libraryContext.state.library,
            parent: libraryContext.state.library,
        });

    useEffect(() => {

        logger.info({
            context: "StageAuthor.useEffect",
            volume: Abridgers.AUTHOR(props.author),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.author]);

    const handleAdd: OnAction = () => {
        const newAuthor = new Author({
            active: true,
            first_name: null,
            last_name: null,
            library_id: libraryId,
            notes: null,
            principal: false,
        })
        logger.debug({
            context: "StageAuthor.handleAdd",
            author: newAuthor,
        });
        setAuthor(newAuthor);
    }

    const handleEdit: HandleAuthor = (theAuthor) => {
        logger.debug({
            context: "StageAuthor.handleEdit",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthor(theAuthor);
    }

    const handleInsert: HandleAuthor = async (theAuthor) => {
        const inserted = await performInsert(theAuthor);
        setAuthor(null);
        props.handleAuthor(inserted);
    }

    const handleRemove: HandleAuthor = async (theAuthor) => {
        await performRemove(theAuthor);
        setAuthor(null);
        props.handleAuthor(new Author());
    }

    const handleSeries: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "StageAuthor.handleSeries",
            author: theAuthor,
        });
        props.handleAuthor(theAuthor);
        props.handleStage(Stage.SERIES);
    }

    const handleStories: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "StageAuthor.handleStories",
            author: theAuthor,
        });
        props.handleAuthor(theAuthor);
        props.handleStage(Stage.STORIES);
    }

    const handleUpdate: HandleAuthor = async (theAuthor) => {
        const updated = await performUpdate(theAuthor);
        setAuthor(null);
        props.handleAuthor(updated);
        props.handleRefresh();
    }

    const handleVolumes: HandleAuthor = async (theAuthor) => {
        logger.debug({
            context: "StageAuthor.handleVolumes",
            author: theAuthor,
        });
        props.handleAuthor(theAuthor);
        props.handleStage(Stage.VOLUMES);
    }

    return (
        <Container fluid id="StageAuthor">

            {/* List View */}
            {(!author) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={true}
                                size="sm"
                                variant="outline-success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            <span>Select or Create Author for Library:&nbsp;</span>
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={true}
                                size="sm"
                                variant="outline-success"
                            >Next</Button>
                        </Col>
                    </Row>

                    <AuthorOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleSeries={handleSeries}
                        handleStories={handleStories}
                        handleVolumes={handleVolumes}
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
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Author for Library:&nbsp;
                            <span className="text-info">
                                {libraryContext.state.library.name}
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

export default StageAuthor;

