// StageAuthors --------------------------------------------------------------

// Select Author(s) for the currently selected Series/Volume, while offering
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
import AuthorClient from "../../clients/AuthorClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    parent: Series | Volume;            // Currently selected Series/Volume
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
            parent: props.parent,
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

    const handleEdit: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleEdit",
            author: newAuthor,
        });
        setAuthor(newAuthor);
    }

    const handleExclude: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleExclude",
            msg: "Excluding Author for Series/Volume",
            author: newAuthor,
            parent: props.parent,
        });
        try {

            // Exclude this Author for the current Series/Volume
            if (props.parent instanceof Series) {
                await AuthorClient.seriesExclude(libraryId, newAuthor.id, props.parent.id);
            } else {
                await AuthorClient.volumesExclude(libraryId, newAuthor.id, props.parent.id);
            }
            logger.info({
                context: "StageAuthors.handleExclude",
                msg: "Excluded Author for Series/Volume",
                parent: props.parent,
                author: newAuthor,
            });

            // For any Story in this Series/Volume, exclude this Author
            for (const story of props.parent.stories) {
                try {
                    await AuthorClient.storiesExclude(libraryId, newAuthor.id, story.id);
                } catch (error) {
                    // Ignore errors if already excluded

                }
            }

        } catch (error) {
            ReportError("StageAuthors.handleExclude", error);
        }
        props.handleRefresh();
    }

    const handleInclude: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleInclude",
            msg: "Including Author for Series/Volume",
            author: newAuthor,
            parent: props.parent,
        });
        try {

            // Include this Author for the current Series/Volume
            newAuthor.principal = true; // Assume by default
            if (props.parent instanceof Series) {
                await AuthorClient.seriesInclude(libraryId, newAuthor.id, props.parent.id, newAuthor.principal);
            } else {
                await AuthorClient.volumesInclude(libraryId, newAuthor.id, props.parent.id, newAuthor.principal);
            }
            logger.info({
                context: "StageAuthors.handleInclude",
                msg: "Included Author for Series/Volume",
                parent: props.parent,
                author: newAuthor,
            });

        } catch (error) {
            ReportError("StageAuthors.handleInclude", error);
        }
        props.handleRefresh();
    }

    const handleInsert: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleInsert",
            msg: "Inserting new Author",
            author: newAuthor,
        });
        try {

            // Persist the new Author
            const inserted = await AuthorClient.insert(libraryId, newAuthor);
            logger.info({
                context: "StageAuthors.insert",
                msg: "Inserted new Author",
                author: inserted,
            })
            setAuthor(null);

            // Assume a new Author is included in the current Series/Volume
            await handleInclude(inserted);

        } catch (error) {
            ReportError("StageAuthors.handleInsert", error);
        }
        props.handleRefresh();
    }

    const handleRemove: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleRemove",
            msg: "Removing existing Author",
            author: newAuthor,
        });
        try {
            AuthorClient.remove(libraryId, newAuthor.id);
            logger.info({
                context: "StageAuthors.handleRemove",
                msg: "Removed existing Author",
                author: newAuthor,
            });
            // Database constraints will deal with any join tables
            setAuthor(null);
        } catch (error) {
            ReportError("StageAuthors.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleUpdate: HandleAuthor = async (newAuthor) => {
        logger.debug({
            context: "StageAuthors.handleUpdate",
            msg: "Updating existing Author",
            author: newAuthor,
        });
        try {

            // Update the Author itself
            await AuthorClient.update(libraryId, newAuthor.id, newAuthor);
            logger.info({
                context: "StageAuthors.handleUpdate",
                msg: "Updated existing Author",
                author: newAuthor,
            });

            // If the principal changed, remove and insert to update it
            if (author && (newAuthor.principal !== author.principal)) {
                logger.info({
                    context: "StageAuthors.handleUpdate",
                    msg: "Reregister Author-Series/Author-Volume for new principal",
                    author: newAuthor,
                });
                try {
                    if (props.parent instanceof Series) {
                        await AuthorClient.seriesExclude(libraryId, newAuthor.id, props.parent.id);
                    } else {
                        await AuthorClient.volumesExclude(libraryId, newAuthor.id, props.parent.id);
                    }
                } catch (error) {
                    // Ignore error if not previously included
                }
                try {
                    if (props.parent instanceof Series) {
                        await AuthorClient.seriesInclude(libraryId, newAuthor.id, props.parent.id, newAuthor.principal);
                    } else {
                        await AuthorClient.volumesInclude(libraryId, newAuthor.id, props.parent.id, newAuthor.principal);
                    }
                } catch (error) {
                    ReportError("StageAuthors.handleUpdate.include", error);
                }
            } else {
                logger.info({
                    context: "StageAuthors.handleUpdate",
                    msg: "No reregister is required",
                    author: newAuthor,
                });
            }
            setAuthor(null);
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.handleRefresh();
    }

    // Is the specified Author currently included for this Series/Volume?
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
