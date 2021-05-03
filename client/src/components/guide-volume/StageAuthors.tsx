// StageAuthors --------------------------------------------------------------

// Select Author(s) for the currently selected Volume, while offering the
// option to edit existing Authors or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import AuthorOptions from "./AuthorOptions";
import {HandleStage, Stage} from "./GuideVolume";
import {HandleAction, HandleAuthor, OnAction, Scopes} from "../types";
import AuthorForm from "../authors/AuthorForm";
import AuthorClient from "../../clients/AuthorClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    authors: Author[];                  // Currently included Authors
    doRefresh: HandleAction;            // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    volume: Volume;                     // Currently selected volume
}

// Component Details ---------------------------------------------------------

const StageAuthors = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [author, setAuthor] = useState<Author | null>(null);
    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);

    useEffect(() => {

        logger.info({
            context: "StageAuthors.useEffect",
            volume: props.volume ? props.volume : undefined,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext, loginContext,
        libraryId, props.authors, props.volume]);

    const handleAdd: OnAction = () => {
        const newAuthor = new Author({library_id: libraryId});
        logger.trace({
            context: "StageAuthors.handleAdd",
            author: newAuthor,
        });
        setAuthor(newAuthor);
    }

    const handleEdit: HandleAuthor = async (newAuthor) => {
        logger.trace({
            context: "StageAuthors.handleEdit",
            author: newAuthor,
        });
        setAuthor(newAuthor);
    }

    const handleExclude: HandleAuthor = async (newAuthor) => {
        logger.info({
            context: "StageAuthors.handleExclude",
            author: newAuthor,
            volume: props.volume,
        });
        try {
            const disassociated = await AuthorClient.volumesAuthorExclude
               (libraryId, newAuthor.id, props.volume.id);
            logger.trace({
                context: "StageAuthors.handleExclude",
                author: newAuthor,
                disassociated: disassociated,
            });
        } catch (error) {
            ReportError("StageAuthors.handleExclude", error);
        }
        props.doRefresh();
    }

    const handleInclude: HandleAuthor = async (newAuthor) => {
        logger.info({
            context: "StageAuthors.handleInclude",
            author: newAuthor,
            volume: props.volume,
        });
        try {
            const associated = await AuthorClient.volumesAuthorInclude
                (libraryId, newAuthor.id, props.volume.id);
            logger.trace({
                context: "StageAuthors.handleInclude",
                author: newAuthor,
                associated: associated,
            });
        } catch (error) {
            ReportError("StageAuthors.handleInclude", error);
        }
        props.doRefresh();
    }

    const handleInsert: HandleAuthor = async (newAuthor) => {
        logger.info({
            context: "StageAuthors.handleInsert",
            volume: newAuthor,
        });
        try {
            const inserted = await AuthorClient.insert(libraryId, newAuthor);
            setAuthor(null);
            logger.trace({
                context: "StageAuthors.handleInsert",
                inserted: inserted,
            });
            // Assume a newly added Author should be associated with our Volume
            await handleInclude(inserted);
        } catch (error) {
            ReportError("StageAuthors.handleInsert", error);
        }
        props.doRefresh();
    }

    const handleRemove: HandleAuthor = async (newAuthor) => {
        logger.info({
            context: "StageAuthors.handleRemove",
            volume: newAuthor,
        });
        try {
            const removed = AuthorClient.remove(libraryId, newAuthor.id);
            setAuthor(null);
            logger.trace({
                context: "StageAuthors.handleRemove",
                removed: removed,
            });
        } catch (error) {
            ReportError("StageAuthors.handleRemove", error);
        }
        props.doRefresh();
    }

    const handleUpdate: HandleAuthor = async (newAuthor) => {
        logger.info({
            context: "StageAuthors.handleUpdate",
            volume: newAuthor,
        });
        try {
            const updated = await AuthorClient.update(libraryId, newAuthor.id, newAuthor);
            setAuthor(null);
            logger.trace({
                context: "StageAuthors.handleUpdate",
                updated: updated,
            });
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.doRefresh();
    }

    // Is the specified Author currently included for this Volume?
    const included = (author: Author): boolean => {
        let result = false;
        props.authors.forEach(includedAuthor => {
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
                                onClick={() => props.handleStage(Stage.VOLUME)}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            <span>Manage Authors for Volume:&nbsp;</span>
                            <span className="text-info">
                                {props.volume.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                // TODO - when is this disabled?
                                disabled={props.authors.length < 1}
                                onClick={() => props.handleStage(Stage.STORIES)}
                                size="sm"
                                variant={(props.authors.length < 1) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <AuthorOptions
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        included={included}
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
                            {(included(author)) ? (
                                <>
                                    <span>Author for Volume:&nbsp;</span>
                                    <span className="text-info">
                                        {props.volume.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Author for Library:&nbsp;</span>
                                    <span className="text-info">
                                        {libraryContext.state.library.name}
                                    </span>
                                </>
                            )}
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
