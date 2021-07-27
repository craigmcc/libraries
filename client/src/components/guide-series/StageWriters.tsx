// StageWriters --------------------------------------------------------------

// Select Writer(s) (Author(s)) for the currently selected Story, while
// offering the option to edit existing Authors or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleAuthor, OnAction, Scopes} from "../types";
import AuthorForm from "../authors/AuthorForm";
import {HandleStage, Stage} from "../guide-shared/Stage";
import WriterOptions from "../guide-shared/WriterOptions";
import AuthorClient from "../../clients/AuthorClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    story: Story;                       // Currently selected story
}

// Component Details ---------------------------------------------------------

const StageWriters = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [writer, setWriter] = useState<Author | null>(null);

    useEffect(() => {

        logger.info({
            context: "StageWriters.useEffect",
            story: props.story,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.story]);

    const handleAdd: OnAction = () => {
        const newWriter = new Author({
            first_name: null,
            last_name: null,
            library_id: libraryId,
            notes: null,
            principal: true,
        });
        logger.debug({
            context: "StageWriters.handleAdd",
            msg: "Adding new Writer",
            writer: newWriter,
        });
        setWriter(newWriter);
    }

    const handleEdit: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleEdit",
            msg: "Editing existing Writer",
            writer: newWriter,
        });
        setWriter(newWriter);
    }

    const handleExclude: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleExclude",
            msg: "Excluding Writer for Story",
            writer: newWriter,
            story: props.story,
        });
        try {

            // Exclude this Writer for the current Story
            /* const disassociated = */ await AuthorClient.storiesExclude
                (libraryId, newWriter.id, props.story.id);
            logger.info({
                context: "StageWriters.handleExclude",
                msg: "Excluded Writer for Story",
                story: props.story,
                writer: newWriter,
            });

        } catch (error) {
            ReportError("StageWriters.handleExclude", error);
        }
        props.handleRefresh();
    }

    const handleInclude: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleInclude",
            msg: "Including Author for Story",
            writer: newWriter,
            story: props.story,
        });
        try {

            // Include this Writer for the current Story
            newWriter.principal = true; // Assume by default
            /* const associated = */ await AuthorClient.storiesInclude
                (libraryId, newWriter.id, props.story.id, newWriter.principal);
            logger.info({
                context: "StageWriters.handleInclude",
                msg: "Included Writer for Story",
                story: props.story,
                writer: newWriter,
            });

        } catch (error) {
            ReportError("StageWriters.handleInclude", error);
        }
        props.handleRefresh();
    }

    const handleInsert: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleInsert",
            msg: "Inserting new Writer",
            writer: newWriter,
        });
        try {

            // Persist the new Writer
            const inserted = await AuthorClient.insert(libraryId, newWriter);
            logger.info({
                context: "StageWriters.handleInsert",
                msg: "Inserted new Writer",
                writer: newWriter,
            });
            setWriter(null);

            // Assume a new Author is included in the current Story
            await handleInclude(inserted);

        } catch (error) {
            ReportError("StageWriters.handleInsert", error);
        }
        props.handleRefresh();
    }

    const handleRemove: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleRemove",
            msg: "Removing existing Writer",
            writer: newWriter,
        });
        try {
            AuthorClient.remove(libraryId, newWriter.id);
            logger.info({
                context: "StageWriters.handleRemove",
                msg: "Removed existing Writer",
                writer: newWriter,
            });
            setWriter(null);
        } catch (error) {
            ReportError("StageWriters.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleUpdate: HandleAuthor = async (newWriter) => {
        logger.debug({
            context: "StageWriters.handleUpdate",
            msg: "Updating existing Writer",
            writer: newWriter,
        });
        try {
            // Update the Writer itself
            await AuthorClient.update(libraryId, newWriter.id, newWriter);
            logger.info({
                context: "StageWriters.handleUpdate",
                msg: "Updated existing Writer",
                writer: newWriter,
            });
            // If the principal changed, remove and insert to update it
            if (writer && (newWriter.principal !== writer.principal)) {
                logger.info({
                    context: "StageWriters.handleUpdate",
                    msg: "Reregister Author-Story for new principal",
                    writer: newWriter,
                });
                try {
                    await AuthorClient.storiesExclude
                        (libraryId, newWriter.id, props.story.id);
                } catch (error) {
                    // Ignore error if not previously included
                }
                try {
                    await AuthorClient.storiesInclude
                        (libraryId, newWriter.id, props.story.id, newWriter.principal);
                } catch (error) {
                    ReportError("StageAuthors.handleUpdate.include", error);
                }
            } else {
                logger.info({
                    context: "StageWriters.handleUpdate",
                    msg: "No reregister is required",
                    writer: newWriter,
                });
            }
            setWriter(null);
        } catch (error) {
            ReportError("StageWriters.handleUpdate", error);
        }
        props.handleRefresh();
    }

    // Is the specified Author currently included for this Story?
    const included = (writer: Author): boolean => {
        let result = false;
        props.story.authors.forEach(includedWriter => {
            if (writer.id === includedWriter.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageWriters">

            {/* List View */}
            {(!writer) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={false}
                                onClick={() => props.handleStage(Stage.STORIES)}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            <span>Manage Writers for Story:&nbsp;</span>
                            <span className="text-info">
                                {props.story.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={true}
                                onClick={() => props.handleStage(Stage.STORIES)}
                                size="sm"
                                variant={(props.story.authors.length < 1) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <WriterOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        included={included}
                        story={props.story}
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
            {(writer) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(writer.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            <span>Writer for Story:&nbsp;</span>
                            <span className="text-info">
                                {props.story.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setWriter(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <AuthorForm
                        author={writer}
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

export default StageWriters;
