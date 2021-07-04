// StageStories --------------------------------------------------------------

// Select Story(ies) for the currently selected Series, while offering the
// option to edit existing Stories or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleStage, Stage} from "./GuideSeries";
import StoryOptions from "./StoryOptions";
import {HandleAction, HandleStory, OnAction, Scopes} from "../types";
import StoryForm from "../stories/StoryForm";
import AuthorClient from "../../clients/AuthorClient";
import SeriesClient from "../../clients/SeriesClient";
import StoryClient from "../../clients/StoryClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleStory: HandleStory;           // Handle selecting a Story
    series: Series;                     // Currently selected Series
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
            series: props.series,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [loginContext, libraryId, props.series]);

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

    const handleEdit: HandleStory = async (newStory) => {
        logger.debug({
            context: "StageStories.handleEdit",
            story: newStory,
        });
        setStory(newStory);
    }

    // Exclude this Story from the current Series, but not the current Author
    const handleExclude: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleExclude",
            msg: "Excluding Story for Series",
            series: props.series,
            story: newStory,
        });
        try {
            const disassociated = await SeriesClient.storiesExclude
                (libraryId, props.series.id, newStory.id);
            logger.info({
                context: "StageStories.handleExclude",
                story: newStory,
                disassociated: disassociated,
            });
        } catch (error) {
            ReportError("StageStories.handleExclude", error);
        }
        props.handleRefresh();
    }

    // Include this Story in the current Volume, no effect on Author(s)
    const handleInclude: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleInclude",
            msg: "Including Story for Series",
            series: props.series,
            story: newStory,
        });
        try {
            const associated = await SeriesClient.storiesInclude
                (libraryId, props.series.id, newStory.id);
            logger.info({
                context: "StageStories.handleInclude",
                story: newStory,
                associated: associated,
            });
        } catch (error) {
            ReportError("StageStories.handleInclude", error);
        }
        props.handleRefresh();
    }

    const handleInsert: HandleStory = async (newStory) => {
        try {

            // Persist the new Story
            const inserted = await StoryClient.insert(libraryId, newStory);
            logger.info({
                context: "StageStories.handleInsert",
                msg: "Inserting new Story",
                story: inserted,
            });
            setStory(null);

            // Assume the new Story is included in the current Series
            await handleInclude(inserted);

            // Assume that the Author(s) for this Series wrote this Story as well.
            logger.info({
                context: "StageStories.handleInsert",
                msg: "About to add Story Authors",
                story: inserted,
                authors: props.series.authors,
            });
            for (const author of props.series.authors) {
                logger.info({
                    context: "StageStories.handleInsert",
                    msg: "Adding Story Author",
                    story: inserted,
                    author: author,
                });
                await AuthorClient.storiesInclude(libraryId, author.id, inserted.id);
            }

            props.handleStory(inserted);    // Select the new Story
            props.handleRefresh();

        } catch (error) {
            ReportError("StageStories.handleInsert", error);
            props.handleRefresh();
        }
    }

    const handleRemove: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleRemove",
            story: newStory,
        });
        try {
            StoryClient.remove(libraryId, newStory.id);
            setStory(null);
            // Database cascades will take care of joins
        } catch (error) {
            ReportError("StageStories.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleSelect: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleSelect",
            story: newStory,
        });
        props.handleStory(newStory);
        props.handleRefresh();
    }

    const handleUpdate: HandleStory = async (newStory) => {
        logger.info({
            context: "StageStories.handleUpdate",
            story: newStory,
        });
        try {
            await StoryClient.update(libraryId, newStory.id, newStory);
            setStory(null);
        } catch (error) {
            ReportError("StageAuthors.handleUpdate", error);
        }
        props.handleRefresh();
    }

    // Is the specified Story currently included for this Volume?
    const included = (story: Story): boolean => {
        let result = false;
        props.series.stories.forEach(includedStory => {
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
                            <span>Manage Stories for Series:&nbsp;</span>
                            <span className="text-info">
                                {props.series.name}
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
                        handleInsert={handleInsert}
                        handleSelect={handleSelect}
                        included={included}
                        series={props.series}
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
                            <span>Story for Series:&nbsp;</span>
                            <span className="text-info">
                                {props.series.name}
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
