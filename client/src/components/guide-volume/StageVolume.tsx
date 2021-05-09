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

import {HandleStage, Stage} from "./GuideVolume";
import VolumeOptions from "./VolumeOptions";
import {HandleAction, HandleVolume, OnAction, Scopes} from "../types";
import VolumeForm from "../volumes/VolumeForm";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Volume from "../../models/Volume";
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
            volume: props.volume ? props.volume : undefined,
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext, loginContext,
        libraryId, volume, props.volume]);

    const handleAdd: OnAction = () => {
        const newVolume = new Volume({
            library_id: libraryId,
            location: "Kindle",
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
            volume: newVolume,
        });
        setVolume(newVolume);
    }

    const handleInsert: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleInsert",
            volume: newVolume,
        });
        try {
            const inserted = await VolumeClient.insert(libraryId, newVolume);
            setVolume(null);
            props.handleVolume(inserted); // Implicitly select the new Volume
        } catch (error) {
            ReportError("StageVolume.handleInsert", error);
        }
        props.handleRefresh();
    }

    const handleRemove: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleRemove",
            volume: newVolume,
        });
        try {
            await VolumeClient.remove(libraryId, newVolume.id);
            setVolume(null);
        } catch (error) {
            ReportError("StageVolume.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleSelect: HandleVolume = (newVolume) => {
        logger.debug({
            context: "StageVolume.handleSelect",
            volume: newVolume,
        });
        props.handleVolume(newVolume);
    }

    const handleUpdate: HandleVolume = async (newVolume) => {
        logger.debug({
            context: "StageVolume.handleUpdate",
            volume: newVolume,
        });
        try {
            await VolumeClient.update(libraryId, newVolume.id, newVolume);
            setVolume(null);
        } catch (error) {
            ReportError("StageVolume.handleUpdate", error);
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
