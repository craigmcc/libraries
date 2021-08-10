// StageStories --------------------------------------------------------------

// Select Story(ies) for the currently selected Series/Volume, while offering
// the option to edit existing Stories or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import {HandleStage, Stage} from "./Stage";
import StoryOptions from "./StoryOptions";
import StoryForm from "../stories/StoryForm";
import AuthorClient from "../../clients/AuthorClient";
import SeriesClient from "../../clients/SeriesClient";
import StoryClient from "../../clients/StoryClient";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleStory: HandleStory;           // Handle selecting a Story
    parent: Series | Volume;            // Currently selected Series or Volume
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
            series: props.parent,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.parent]);

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

    // Exclude this Story from the current Series/Volume, no effect on Author(s)
    const handleExclude: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleExclude",
            msg: "Excluding Story for Series/Volume",
            parent: props.parent,
            story: newStory,
        });
        try {
            if (props.parent instanceof Series) {
                await SeriesClient.storiesExclude
                    (libraryId, props.parent.id, newStory.id);
            } else {
                await VolumeClient.storiesExclude
                    (libraryId, props.parent.id, newStory.id);
            }
            logger.info({
                context: "StageStories.handleExclude",
                msg: "Excluded Story for Series/Volume",
                parent: props.parent,
                story: newStory,
            });
        } catch (error) {
            ReportError("StageStories.handleExclude", error);
        }
        props.handleRefresh();
    }

    // Include this Story in the current Series/Volume, no effect on Author(s)
    const handleInclude: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleInclude",
            msg: "Including Story for Series/Volume",
            parent: props.parent,
            story: newStory,
        });
        try {
            if (props.parent instanceof Series) {
                await SeriesClient.storiesInclude
                    (libraryId, props.parent.id, newStory.id, newStory.ordinal);
            } else {
                await VolumeClient.storiesInclude
                    (libraryId, props.parent.id, newStory.id);
            }
            logger.info({
                context: "StageStories.handleInclude",
                msg: "Included Story for Series/Volume",
                series: props.parent,
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

            // Assume the new Story is included in the current Series/Volume
            inserted.ordinal = newStory.ordinal; // Carry ordinal (if any) forward
            await handleInclude(inserted);

            // Assume that the Author(s) for this Series/Volume wrote this Story as well.
            logger.debug({
                context: "StageStories.handleInsert",
                msg: "About to add Story Authors",
                story: inserted,
                authors: props.parent.authors,
            });
            for (const author of props.parent.authors) {
                logger.info({
                    context: "StageStories.handleInsert",
                    msg: "Adding Story Author",
                    story: inserted,
                    author: author,
                });
                await AuthorClient.storiesInclude(libraryId, author.id, inserted.id, author.principal);
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

            // Update the Story itself
            await StoryClient.update(libraryId, newStory.id, newStory);
            logger.info({
                context: "StageStories.handleUpdate",
                msg: "Updated existing Story",
                story: newStory,
            });

            // If the ordinal changed (Series-Story only), remove and insert to update it
            if ((props.parent instanceof Series) && story && (newStory.ordinal !== story.ordinal)) {
                logger.info({
                    context: "StageStories.handleUpdate",
                    msg: "Reregister Series-Story for new ordinal",
                    story: newStory,
                });
                try {
                    await SeriesClient.storiesExclude
                        (libraryId, props.parent.id, newStory.id);
                } catch (error) {
                    // Ignore error if not previously included
                }
                try {
                    await SeriesClient.storiesInclude
                        (libraryId, props.parent.id, newStory.id, newStory.ordinal);
                } catch (error) {
                    ReportError("StageStories.handleUpdate.include", error);
                }
            } else {
                logger.info({
                    context: "StageStories.handleUpdate",
                    msg: "No reregister is required",
                    story: newStory,
                });
            }
            setStory(null);

        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.handleRefresh();
    }

    // Is the specified Story currently included for this Series/Volume?
    const included = (story: Story): boolean => {
        let result = false;
        props.parent.stories.forEach(includedStory => {
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
                            {(props.parent instanceof Series) ? (
                                <span>Manage Stories for Series:&nbsp;</span>
                            ) : (
                                <span>Manage Stories for Volume:&nbsp;</span>
                            )}
                            <span className="text-info">
                                {props.parent.name}
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
            {(story) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(story.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            {(props.parent instanceof Series) ? (
                                <span>Story for Series:&nbsp;</span>
                            ) : (
                                <span>Story for Volume:&nbsp;</span>
                            )}
                            <span className="text-info">
                                {props.parent.name}
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