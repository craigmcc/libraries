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
import {HandleVolume, OnAction, Scopes} from "../types";
import VolumeForm from "../volumes/VolumeForm";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleVolume;         // Handle request to select a Volume
    volume?: Volume;                    // Currently selected Volume (if any)
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
        const newVolume = new Volume({library_id: libraryId});
        logger.trace({
            context: "StageVolume.handleAdd",
            volume: newVolume,
        });
        setVolume(newVolume);
    }

    const handleBack: OnAction = () => {
        logger.trace({
            context: "StageVolume.handleBack"
        });
        setVolume(null);
    }

    const handleEdit: HandleVolume = (newVolume) => {
        logger.info({
            context: "StageVolume.handleEdit",
            volume: newVolume,
        });
        setVolume(newVolume);
    }

    const handleInsert: HandleVolume = async (newVolume) => {
        logger.info({
            context: "StageVolume.handleInsert",
            volume: newVolume,
        });
        try {
            const inserted = await VolumeClient.insert(libraryId, newVolume);
            setVolume(null);
            logger.trace({
                context: "StageVolume.handleInsert",
                inserted: inserted,
            });
        } catch (error) {
            ReportError("StageVolume.handleInsert", error);
        }
    }

    const handleRemove: HandleVolume = async (newVolume) => {
        logger.info({
            context: "StageVolume.handleRemove",
            volume: newVolume,
        });
        try {
            const removed = VolumeClient.remove(libraryId, newVolume.id);
            setVolume(null);
            logger.trace({
                context: "StageVolume.handleRemove",
                removed: removed,
            });
        } catch (error) {
            ReportError("StageVolume.handleRemove", error);
        }
    }

    const handleSelect: HandleVolume = (newVolume) => {
        logger.info({
            context: "StageVolume.handleSelect",
            volume: newVolume,
        });
        props.handleSelect(newVolume);
    }

    const handleUpdate: HandleVolume = async (newVolume) => {
        logger.info({
            context: "StageVolume.handleUpdate",
            volume: newVolume,
        });
        try {
            const updated = await VolumeClient.update(libraryId, newVolume.id, newVolume);
            setVolume(null);
            logger.trace({
                context: "StageVolume.handleUpdate",
                inserted: updated,
            });
        } catch (error) {
            ReportError("StageVolume.handleUpdate", error);
        }
    }

    // TODO - need stage navigation options eventually
    return (
        <Container fluid id="StageVolume">

            {/* List View */}
            {(!volume) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            <span>Manage and Select Volume for Library:&nbsp;</span>
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
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
                                onClick={handleBack}
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
