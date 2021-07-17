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
    handleRefresh: HandleAction;        // Trigger a UI refresh
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
            volume: props.volume,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.volume]);

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
            msg: "Excluding Author for Volume",
            author: newAuthor,
            volume: props.volume,
        });
        try {

            // Exclude this Author for the current Volume
            /* const disassociated = */ await AuthorClient.volumesExclude
               (libraryId, newAuthor.id, props.volume.id);
            logger.info({
                context: "StageAuthors.handleExclude",
                msg: "Excluded Author for Volume",
                volume: props.volume,
                author: newAuthor,
            });

            // For any Story in this Volume, exclude this Author
            for (const story of props.volume.stories) {
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
            msg: "Including Author for Volume",
            author: newAuthor,
            volume: props.volume,
        });
        try {

            // Include this Author for the current Volume
            newAuthor.principal = true; // Assume by default
            /* const associated = */ await AuthorClient.volumesInclude
                (libraryId, newAuthor.id, props.volume.id, newAuthor.principal);
            logger.info({
                context: "StageAuthors.handleInclude",
                msg: "Included Author for Volume",
                volume: props.volume,
                author: newAuthor,
            });

            // For "Single" or "Collection" Volume, add to Authors for each Story
            if ((props.volume.type === "Single") || (props.volume.type === "Collection")) {
                logger.info({
                    context: "StageAuthors.handleInclude",
                    msg: `Adding Author to ${props.volume.stories.length} Stories`,
                });
                for (const story of props.volume.stories) {
                    await AuthorClient.storiesInclude(libraryId, newAuthor.id, story.id, newAuthor.principal);
                }
            }


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

            // Assume a new Author is included in the current Volume
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
            })
            setAuthor(null);
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        // If the principal changed, remove and insert to update it
        if (author && (newAuthor.principal !== author.principal)) {
            logger.info({
                context: "StageAuthors.handleUpdate",
                msg: "Reregister Author-Series for new principal",
                author: newAuthor,
            });
            try {
                await AuthorClient.volumesExclude
                    (libraryId, newAuthor.id, props.volume.id);
            } catch (error) {
                // Ignore error if not previously included
            }
            try {
                await AuthorClient.volumesInclude
                (libraryId, newAuthor.id, props.volume.id, newAuthor.principal);
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
        props.handleRefresh();
    }

    // Is the specified Author currently included for this Volume?
    const included = (author: Author): boolean => {
        let result = false;
        props.volume.authors.forEach(includedAuthor => {
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
                                disabled={props.volume.authors.length < 1}
                                onClick={() => props.handleStage(Stage.STORIES)}
                                size="sm"
                                variant={(props.volume.authors.length < 1) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <AuthorOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        included={included}
                        volume={props.volume}
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
                            <span>Author for Volume:&nbsp;</span>
                            <span className="text-info">
                                {props.volume.name}
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
