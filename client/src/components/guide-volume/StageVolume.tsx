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
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateVolume from "../../hooks/useMutateVolume";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

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

    const [{performInsert, performRemove, performUpdate/*, error, processing*/}]
        = useMutateVolume({ // TODO error/processing
            library: libraryContext.state.library,
        });

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

    const handleEdit: HandleVolume = (theVolume) => {
        logger.debug({
            context: "StageVolume.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        });
        setVolume(theVolume);
    }

    const handleInsert: HandleVolume = async (theVolume) => {
        const inserted = await performInsert(theVolume);
        handleSelect(inserted);
    }

    const handleRemove: HandleVolume = async (theVolume) => {
        await performRemove(theVolume);
        setVolume(null);
        props.handleVolume(new Volume());
    }

    const handleSelect: HandleVolume = (theVolume) => {
        logger.debug({
            context: "StageVolume.handleSelect",
            volume: theVolume,
        });
        props.handleVolume(theVolume);
        props.handleStage(Stage.AUTHORS);
    }

    const handleUpdate: HandleVolume = async (theVolume) => {
        const updated = await performUpdate(theVolume);
        setVolume(null);
        props.handleVolume(updated);
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
