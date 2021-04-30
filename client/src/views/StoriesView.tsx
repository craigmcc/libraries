// StoriesView -------------------------------------------------------------

// Administrator view for editing Stories.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import StoryChildren from "../children/StoryChildren";
import StoryClient from "../clients/StoryClient";
import {HandleStory, HandleStoryOptional, Scopes} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import StoryForm from "../forms/StoryForm";
import Author from "../models/Author";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import StoriesSubview from "../subviews/StoriesSubview";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    base?: Author | Series | Volume;    // Parent object to select for [Library]
    nested?: boolean;                   // Show nested child list? [false]
    title?: string;                     // Table title [Stories for Library: XXXXX]
}

// Component Details ---------------------------------------------------------

const StoriesView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [libraryId, setLibraryId] = useState<number>(-1);
    const [nested] = useState<boolean>((props.nested !== undefined)
        ? props.nested : false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [story, setStory] = useState<Story | null>(null);

    useEffect(() => {

        logger.info({
            context: "StoriesView.useEffect",
            base: props.base,
            nested: props.nested,
            title: props.title,
        });

        // Record current Library ID
        setLibraryId(libraryContext.state.library.id);

        // Record current permissions
        const isRegular = loginContext.validateScope(Scopes.REGULAR);
        setCanAdd(isRegular);
        setCanEdit(isRegular);
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

        // Reset refresh flag if set
        if (refresh) {
            setRefresh(false);
        }

    }, [libraryContext, loginContext, refresh,
        props.base, props.nested, props.title]);

    const handleInsert: HandleStory = async (newStory) => {
        try {
            newStory.library_id = libraryId;
            const inserted: Story = await StoryClient.insert(libraryId, newStory);
            setRefresh(true);
            setStory(null);
            logger.trace({
                context: "StoriesView.handleInsert",
                story: Abridgers.STORY(inserted),
            });
        } catch (error) {
            ReportError("StoriesView.handleInsert", error);
        }
    }

    const handleRemove: HandleStory = async (newStory) => {
        try {
            const removed: Story = await StoryClient.remove(libraryId, newStory.id);
            setRefresh(true);
            setStory(null);
            logger.trace({
                context: "StoriesView.handleRemove",
                story: Abridgers.STORY(removed),
            });
        } catch (error) {
            ReportError("StoriesView.handleRemove", error);
        }
    }

    const handleSelect: HandleStoryOptional = (newStory) => {
        if (newStory) {
            if (canEdit) {
                setStory(newStory);
            }
            logger.trace({
                context: "StoriesView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                story: Abridgers.STORY(newStory),
            });
        } else {
            setStory(null);
            logger.trace({
                context: "StoriesView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleStory = async (newStory) => {
        try {
            const updated: Story =
                await StoryClient.update(libraryId, newStory.id, newStory);
            setRefresh(true);
            setStory(null);
            logger.trace({
                context: "StoriesView.handleUpdate",
                story: Abridgers.STORY(updated),
            });
        } catch (error) {
            ReportError("StoriesView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newStory: Story = new Story({
            library_id: libraryId,
        });
        setStory(newStory);
        logger.trace({
            context: "StoriesView.onAdd",
            story: newStory
        });
    }

    const onBack = () => {
        setStory(null);
        logger.trace({
            context: "StoriesView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="StoriesView">

                {/* List View */}
                {(!story) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <StoriesSubview
                                base={props.base ? props.base : undefined}
                                handleSelect={handleSelect}
                                nested={nested}
                                title={props.title ? props.title : undefined}
                            />
                        </Row>

                        <Row className="ml-1 mr-1">
                            <Button
                                disabled={!canAdd}
                                onClick={onAdd}
                                size="sm"
                                variant="primary"
                            >
                                Add
                            </Button>
                        </Row>

                    </>

                ) : null }

                {(story) ? (

                    <>

                        <Row id="StoryDetails" className="mr-1">

                            <Col id="StoryFormView">

                                <Row className="ml-1 mr-1 mb-3">
                                    <Col className="text-left">
                                        <strong>
                                            <>
                                                {(story.id < 0) ? (
                                                    <span>Adding New</span>
                                                ) : (
                                                    <span>Editing Existing</span>
                                                )}
                                                &nbsp;Story for Library:&nbsp;
                                                {libraryContext.state.library.name}
                                            </>
                                        </strong>
                                    </Col>
                                    <Col className="text-right">
                                        <Button
                                            onClick={onBack}
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                        >
                                            Back
                                        </Button>
                                    </Col>
                                </Row>

                                <Row className="ml-1 mr-1">
                                    <StoryForm
                                        autoFocus
                                        canRemove={canRemove}
                                        handleInsert={handleInsert}
                                        handleRemove={handleRemove}
                                        handleUpdate={handleUpdate}
                                        story={story}
                                    />
                                </Row>

                            </Col>

                            {(story.id > 0) ? (
                                <Col id="storyChildren" className="bg-light">
                                    <StoryChildren
                                        story={story}
                                    />
                                </Col>
                            ) : null}

                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default StoriesView;
