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

import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import {HandleStage, Stage} from "../guide-shared/Stage";
import StoryOptions from "../guide-shared/StoryOptions";
import StoryForm from "../stories/StoryForm";
import AuthorClient from "../../clients/AuthorClient";
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
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleStory: HandleStory;           // Handle selecting a Story
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
            volume: props.volume,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.volume]);

    const handleAdd: OnAction = () => {
        const newStory = new Story({
            copyright: null,
            library_id: libraryId,
            name: null,
            notes: null,
        });
        logger.debug({
            context: "StageStories.handleAdd",
            msg: "Adding new Story",
            story: newStory,
        });
        setStory(newStory);
    }

    const handleEdit: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleEdit",
            msg: "Editing existing Story",
            story: newStory,
        });
        setStory(newStory);
    }

    // Exclude this Story from the current Volume, no effect on Author(s)
    const handleExclude: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleExclude",
            msg: "Excluding Story for Volume",
            volume: props.volume,
            story: newStory,
        });
        try {
            /* const disassociated = */ await VolumeClient.storiesExclude
                (libraryId, props.volume.id, newStory.id);
            logger.info({
                context: "StageStories.handleExclude",
                msg: "Excluded Story for Volume",
                volume: props.volume,
                story: newStory,
            });
        } catch (error) {
            ReportError("StageStories.handleExclude", error);
        }
        props.handleRefresh();
    }

    // Include this Story in the current Volume, no effect on Author(s)
    const handleInclude: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleInclude",
            msg: "Including Story for Volume",
            volume: props.volume,
            story: newStory,
        });
        try {
            /* const associated = */ await VolumeClient.storiesInclude
                (libraryId, props.volume.id, newStory.id);
            logger.info({
                context: "StageStories.handleInclude",
                msg: "Included Story for Volume",
                volume: props.volume,
                story: newStory,
            });
        } catch (error) {
            ReportError("StageStories.handleInclude", error);
        }
        props.handleRefresh();
    }

    const handleInsert: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleInsert",
            msg: "Inserting new Story",
            story: newStory,
        });
        try {

            // Persist the new Story
            const inserted = await StoryClient.insert(libraryId, newStory);
            logger.info({
                context: "StageStories.handleInsert",
                msg: "Inserted new Story",
                story: inserted,
            });
            setStory(null);

            // Assume the new Story is included in the current Volume
            await handleInclude(inserted);

            // For Volumes of type "Single" or "Collection", assume
            // that the Author(s) for this Volume wrote this Story as well.
            if ((props.volume.type === "Single") || (props.volume.type === "Collection")) {
                logger.info({
                    context: "StageStories.handleInsert",
                    msg: "About to add Story Authors",
                    story: inserted,
                    authors: props.volume.authors,
                });
                for (const author of props.volume.authors) {
                    logger.info({
                        context: "StageStories.handleInsert",
                        msg: "Adding Story Author",
                        story: inserted,
                        author: author,
                    });
                    await AuthorClient.storiesInclude(libraryId, author.id, inserted.id, author.principal);
                }
            }

            props.handleStory(inserted);    // Select the new Story
            props.handleRefresh();

        } catch (error) {
            ReportError("StageStories.handleInsert", error);
            props.handleRefresh();
        }
    }

    const handleRemove: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleRemove",
            msg: "Removing old Story",
            story: newStory,
        });
        try {
            StoryClient.remove(libraryId, newStory.id);
            logger.info({
                context: "StageStories.handleRemove",
                msg: "Removed old Story",
                story: newStory,
            });
            setStory(null);
            // Database cascades will take care of joins
        } catch (error) {
            ReportError("StageStories.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleSelect: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleSelect",
            story: newStory,
        });
        props.handleStory(newStory);
        props.handleRefresh();
    }

    const handleUpdate: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleUpdate",
            msg: "Updating existing Story",
            story: newStory,
        });
        try {
            await StoryClient.update(libraryId, newStory.id, newStory);
            logger.info({
                context: "StageStories.handleUpdate",
                msg: "Updated existing Story",
                story: newStory,
            })
            setStory(null);
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.handleRefresh();
    }

    // Is the specified Story currently included for this Volume?
    const included = (story: Story): boolean => {
        let result = false;
        props.volume.stories.forEach(includedStory => {
            if (story.id === includedStory.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageStories">

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
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        handleInsert={handleInsert}
                        handleSelect={handleSelect}
                        included={included}
                        parent={props.volume}
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
                            <span>Story for Volume:&nbsp;</span>
                            <span className="text-info">
                                {props.volume.name}
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

export default StageStories;
