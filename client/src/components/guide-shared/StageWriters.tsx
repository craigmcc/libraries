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

import {HandleStage, Stage} from "./Stage";
import WriterOptions from "./WriterOptions";
import {HandleAction, HandleAuthor, OnAction, Scopes} from "../types";
import AuthorForm from "../authors/AuthorForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateAuthor from "../../hooks/useMutateAuthor";
import Author from "../../models/Author";
import Story from "../../models/Story";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

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

    const [{performExclude, performInclude, performInsert, performRemove,
        performUpdate/*, error, processing*/}] = useMutateAuthor({
        author: writer,
        library: libraryContext.state.library,
        parent: props.story,
    });

    useEffect(() => {

        logger.info({
            context: "StageWriters.useEffect",
            story: Abridgers.STORY(props.story),
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
            writer: newWriter,
        });
        setWriter(newWriter);
    }

    const handleEdit: HandleAuthor = async (theWriter) => {
        logger.debug({
            context: "StageWriters.handleEdit",
            writer: Abridgers.AUTHOR(theWriter),
        });
        setWriter(theWriter);
    }

    const handleExclude: HandleAuthor = async (theWriter) => {
        await performExclude(theWriter);
        props.handleRefresh();
    }

    const handleInclude: HandleAuthor = async (theWriter) => {
        await performInclude(theWriter);
        props.handleRefresh();
    }

    const handleInsert: HandleAuthor = async (theWriter) => {
        const inserted = await performInsert(theWriter);
        inserted.principal = theWriter.principal; // Carry principal (if any) forward
        await performInclude(inserted); // Assume new author is included
        setWriter(null);
        props.handleRefresh();
    }

    const handleRemove: HandleAuthor = async (theWriter) => {
        await performRemove(theWriter);
        setWriter(null);
        props.handleRefresh();
    }

    const handleUpdate: HandleAuthor = async (theWriter) => {
        await performUpdate(theWriter);
        setWriter(null);
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
