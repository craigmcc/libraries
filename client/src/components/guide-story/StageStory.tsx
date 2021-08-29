// StageStory ----------------------------------------------------------------

// Select the Story to process for subsequent stages, while offering the option
// to edit an existing Story or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import StoryOptions from "./StoryOptions";
import {HandleStage, Stage} from "../guide-shared/Stage";
import StoryForm from "../stories/StoryForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateStory from "../../hooks/useMutateStory";
import Story from "../../models/Story";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleStory: HandleStory;           // Handle request to select a Story
    story: Story;                       // Currently selected Story (if id>0)
}

// Component Details ---------------------------------------------------------

const StageStory = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [story, setStory] = useState<Story | null>(null);

    const [{performInsert, performRemove, performUpdate/* error, processing*/}]
        = useMutateStory({
            library: libraryContext.state.library,
            parent: libraryContext.state.library,
            story: story,
        });

    useEffect(() => {

        logger.info({
            context: "StageStory.useEffect",
            story: Abridgers.STORY(props.story),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.story]);

    const handleAdd: OnAction = () => {
        const theStory = new Story({
            active: true,
            copyright: null,
            library_id: libraryId,
            name: null,
            notes: null,
            ordinal: null,
        });
        setStory(theStory);
    }

    const handleAuthors: HandleStory = async (theStory) => {
        props.handleStory(theStory);
        props.handleStage(Stage.AUTHORS);
    }

    const handleEdit: HandleStory = (theStory) => {
        setStory(theStory);
    }

    const handleInsert: HandleStory = async (theStory) => {
        const inserted = await performInsert(theStory);
        setStory(null);
        props.handleStory(inserted);
    }

    const handleRemove: HandleStory = async (theStory) => {
        await performRemove(theStory);
        setStory(null);
        props.handleStory(new Story());
    }

    const handleSeries: HandleStory = async (theStory) => {
        props.handleStory(theStory);
        props.handleStage(Stage.SERIES);
    }

    const handleUpdate: HandleStory = async (theStory) => {
        const updated = await performUpdate(theStory);
        setStory(null);
        props.handleStory(updated);
        props.handleRefresh();
    }

    const handleVolumes: HandleStory = async (theStory) => {
        props.handleStory(theStory);
        props.handleStage(Stage.VOLUMES);
    }

    return (
        <Container fluid id="StageStory">

            {/* List View */}
            {(!story) ? (
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
                            <span>Select or Create Story for Library:&nbsp;</span>
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

                    <StoryOptions
                        handleAdd={handleAdd}
                        handleAuthors={handleAuthors}
                        handleEdit={handleEdit}
                        handleSeries={handleSeries}
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
            {(story) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(story.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Story for Library:&nbsp;
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setStory(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <StoryForm
                        autoFocus
                        canRemove={canRemove}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                        story={story}
                    />

                </>
            ) : null}

        </Container>
    )

}

export default StageStory;
