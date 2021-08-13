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

import StoryOptions from "./StoryOptions";
import {HandleStage, Stage} from "./Stage";
import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import StoryForm from "../stories/StoryForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateStory from "../../hooks/useMutateStory";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

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

    const [{performExclude, performInclude, performInsert, performRemove,
        performUpdate/*, error, processing*/}] = useMutateStory({
        library: libraryContext.state.library,
        parent: props.parent,
        story: story,
    });


    useEffect(() => {

        logger.info({
            context: "StageStories.useEffect",
            parent: abridged(props.parent),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.parent]);

    const abridged = (parent: Series | Volume): Series | Volume => {
        if (parent instanceof Series) {
            return Abridgers.SERIES(parent);
        } else /* if (parent instanceof Volume) */ {
            return Abridgers.VOLUME(parent);
        }
    }

    const handleAdd: OnAction = () => {
        const newStory = new Story({
            copyright: null,
            library_id: libraryId,
            name: null,
            notes: null,
        });
        logger.debug({
            context: "StageStories.handleAdd",
            story: newStory,
        });
        setStory(newStory);
    }

    const handleEdit: HandleStory = async (theStory) => {
        logger.debug({
            context: "StageStories.handleEdit",
            story: Abridgers.STORY(theStory),
        });
        setStory(theStory);
    }

    const handleExclude: HandleStory = async (theStory) => {
        await performExclude(theStory);
        props.handleRefresh();
    }

    const handleInclude: HandleStory = async (theStory) => {
        await performInclude(theStory);
        props.handleRefresh();
    }

    const handleInsert: HandleStory = async (theStory) => {
        const inserted = await performInsert(theStory);
        inserted.ordinal = theStory.ordinal; // Carry ordinal (if any) forward
        await performInclude(inserted); // Assume new Story is included
        setStory(null);
        props.handleRefresh();
    }

    const handleRemove: HandleStory = async (theStory) => {
        await performRemove(theStory);
        setStory(null);
        props.handleRefresh();
    }

    const handleSelect: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleSelect",
            story: newStory,
        });
        props.handleStory(newStory);
        props.handleStage(Stage.WRITERS);
        props.handleRefresh();
    }

    const handleUpdate: HandleStory = async (theStory) => {
        await performUpdate(theStory);
        setStory(null);
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
