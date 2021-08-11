// StageVolume ---------------------------------------------------------------

// Select the Volume to process for subsequent stages, while offering the option
// to edit existing Volumes or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import VolumeOptions from "./VolumeOptions";
import {HandleAction, HandleVolume, OnAction, Scopes} from "../types";
import {HandleStage, Stage} from "../guide-shared/Stage";
import VolumeForm from "../volumes/VolumeForm";
import StoryClient from "../../clients/StoryClient";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleVolume: HandleVolume;         // Handle request to select a Volume
    volume: Volume;                     // Currently selected Volume (if id>0)
}

// Component Details ---------------------------------------------------------

const StageVolume = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [volume, setVolume] = useState<Volume | null>(null);

    useEffect(() => {

        logger.info({
            context: "StageVolume.useEffect",
            volume: Abridgers.VOLUME(props.volume),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.volume]);

    const handleAdd: OnAction = () => {
        const newVolume = new Volume({
            copyright: null,
            isbn: null,
            library_id: libraryId,
            location: "Kindle",
            name: null,
            notes: null,
            type: "Single",
        });
        logger.debug({
            context: "StageVolume.handleAdd",
            volume: newVolume,
        });
        setVolume(newVolume);
    }

    const handleEdit: HandleVolume = (newVolume) => {
        logger.debug({
            context: "StageVolume.handleEdit",
            msg: "Editing existing Volume",
            volume: Abridgers.VOLUME(newVolume),
        });
        setVolume(newVolume);
    }

    const handleInsert: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleInsert",
            msg: "Inserting new Volume",
            volume: Abridgers.VOLUME(newVolume),
        });
        try {

            // Persist the requested Volume
            const inserted = await VolumeClient.insert(libraryId, newVolume);
            setVolume(null);

            // If the Volume is of type "Single", create a Story with the same name
            // and associate it with this Volume
            if (inserted.type === "Single") {
                const newStory = new Story({
                    copyright: inserted.copyright ? inserted.copyright : undefined,
                    library_id: inserted.library_id,
                    name: inserted.name,
                    notes: inserted.notes ? inserted.notes : undefined,
                });
                const addedStory = await StoryClient.insert(libraryId, newStory);
                await VolumeClient.storiesInclude(libraryId, inserted.id, addedStory.id);
                logger.info({
                    context: "StageVolume.handleInsert",
                    msg: "Added Story for Volume of type Single",
                    volume: inserted,
                    story: addedStory,
                })
            }

            // Select the inserted Volume, and switch to Authors stage
            handleSelect(inserted);

        } catch (error) {
            ReportError("StageVolume.handleInsert", error);
        }
    }

    const handleRemove: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleRemove",
            msg: "Removing existing Volume",
            volume: Abridgers.VOLUME(newVolume),
        });
        try {
            await VolumeClient.remove(libraryId, newVolume.id);
            logger.info({
                context: "StageVolume.handleRemove",
                msg: "Removed existing Volume",
                volume: newVolume,
            });
            setVolume(null);
            if (newVolume.id === props.volume.id) {
                props.handleVolume(new Volume());   // Unselect if we were current
            }
        } catch (error) {
            ReportError("StageVolume.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleSelect: HandleVolume = (newVolume) => {
        logger.debug({
            context: "StageVolume.handleSelect",
            msg: "Selecting existing Volume",
            volume: Abridgers.VOLUME(newVolume),
        });
        props.handleVolume(newVolume);
        props.handleStage(Stage.AUTHORS);
    }

    const handleUpdate: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleUpdate",
            msg: "Updating existing Volume",
            volume: Abridgers.VOLUME(newVolume),
        });
        try {
            await VolumeClient.update(libraryId, newVolume.id, newVolume);
            logger.info({
                context: "StageVolume.handleUpdate",
                msg: "Updated existing Volume",
                volume: newVolume,
            })
            setVolume(null);
        } catch (error) {
            ReportError("StageVolume.handleUpdate", error);
        }
        // If we updated the currently selected volume, propagate to summary
        if (newVolume.id === props.volume.id) {
            props.handleVolume(newVolume);
        }
        props.handleRefresh();
    }

    return (
        <Container fluid id="StageVolume">

            {/* List View */}
            {(!volume) ? (
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
                            <span>Select or Create Volume for Library:&nbsp;</span>
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={props.volume.id <= 0}
                                onClick={() => props.handleStage(Stage.AUTHORS)}
                                size="sm"
                                variant={(props.volume.id <= 0) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <VolumeOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleSelect={handleSelect}
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
            {(volume) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(volume.id > 0) ? (
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Volume for Library:&nbsp;
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setVolume(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <VolumeForm
                        autoFocus
                        canRemove={canRemove}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                        volume={volume}
                    />

                </>
            ) : null}

        </Container>
    )

}

export default StageVolume;
