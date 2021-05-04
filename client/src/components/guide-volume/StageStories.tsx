// StageStories --------------------------------------------------------------

// Select Story(ies) for the currently selected Volume, while offering the
// option to edit existing Stories or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleStage, Stage} from "./GuideVolume";
import StoryOptions from "./StoryOptions";
import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import StoryForm from "../stories/StoryForm";
import StoryClient from "../../clients/StoryClient";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    doRefresh: HandleAction;            // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    stories: Story[];                   // Currently included Stories
    volume: Volume;                     // Currently selected Volume
}

// Component Details ---------------------------------------------------------

const StageStories = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [story, setStory] = useState<Story | null>(null);

    useEffect(() => {

        logger.info({
            context: "StageStories.useEffect",
            volume: props.volume ? props.volume : undefined,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext, loginContext,
        libraryId, props.stories, props.volume]);

    const handleAdd: OnAction = () => {
        const newStory = new Story({library_id: libraryId});
        logger.trace({
            context: "StageStories.handleAdd",
            story: newStory,
        });
        setStory(newStory);
    }

    const handleEdit: HandleStory = async (newStory) => {
        logger.trace({
            context: "StageStories.handleEdit",
            story: newStory,
        });
        setStory(newStory);
    }

    // Exclude this Story from the current Volume, but not the current Author
    const handleExclude: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleExclude",
            story: newStory,
            volume: props.volume,
        });
        try {
            const disassociated = await VolumeClient.storiesExclude
                (libraryId, props.volume.id, newStory.id);
            logger.trace({
                context: "StageStories.handleExclude",
                disassociated: disassociated,
            });
        } catch (error) {
            ReportError("StageStories.handleExclude", error);
        }
        props.doRefresh();
    }

    // Include this Story in the current Volume, no effect on current Author
    const handleInclude: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleInclude",
            story: newStory,
            volume: props.volume,
        });
        try {
            const associated = await VolumeClient.storiesInclude
                (libraryId, props.volume.id, newStory.id);
            logger.trace({
                context: "StageStories.handleInclude",
                associated: associated,
            });
        } catch (error) {
            ReportError("StageStories.handleInclude", error);
        }
        props.doRefresh();
    }

    const handleInsert: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleInsert",
            volume: newStory,
        });
        try {
            const inserted = await StoryClient.insert(libraryId, newStory);
            setStory(null);
            logger.trace({
                context: "StageStories.handleInsert",
                inserted: inserted,
            });
            // Assume a newly added Story should be associated with our Volume
            await handleInclude(inserted);
            // TODO - associate with Author(s)?  If so, who
        } catch (error) {
            ReportError("StageStories.handleInsert", error);
        }
        props.doRefresh();
    }

    const handleRemove: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleRemove",
            story: newStory,
        });
        try {
            const removed = StoryClient.remove(libraryId, newStory.id);
            setStory(null);
            logger.trace({
                context: "StageStories.handleRemove",
                removed: removed,
            });
            // Database cascades will take care of joins
        } catch (error) {
            ReportError("StageStories.handleRemove", error);
        }
        props.doRefresh();
    }

    const handleUpdate: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleUpdate",
            story: newStory,
        });
        try {
            const updated = await StoryClient.update(libraryId, newStory.id, newStory);
            setStory(null);
            logger.trace({
                context: "StageStories.handleUpdate",
                updated: updated,
            });
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.doRefresh();
    }

    // Is the specified Story currently included for this Volume?
    const included = (story: Story): boolean => {
        let result = false;
        props.stories.forEach(includedStory => {
            if (story.id === includedStory.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageAuthors">

            {/* List View */}
            {(!story) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={false}
                                onClick={() => props.handleStage(Stage.AUTHORS)}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            <span>Manage Stories for Volume:&nbsp;</span>
                            <span className="text-info">
                                {props.volume.name}
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
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        included={included}
                        stories={props.stories}
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
            {(story) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(story.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            {(included(story)) ? (
                                <>
                                    <span>Story for Volume:&nbsp;</span>
                                    <span className="text-info">
                                        {props.volume.name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Story for Library:&nbsp;</span>
                                    <span className="text-info">
                                        {libraryContext.state.library.name}
                                    </span>
                                </>
                            )}
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

export default StageStories;