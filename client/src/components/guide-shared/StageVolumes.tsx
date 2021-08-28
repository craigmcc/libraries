// StageVolumes --------------------------------------------------------------

// Select Volume(s) for the currently selected Author/Story, while offering
// the option to edit existing Volumes or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleStage, Stage} from "./Stage";
import VolumeOptions from "./VolumeOptions";
import {HandleAction, HandleVolume, OnAction, Scopes} from "../types";
import VolumeForm from "../volumes/VolumeForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateVolume from "../../hooks/useMutateVolume";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleStage: HandleStage;           // Handle changing guide stage
    handleVolume: HandleVolume;         // Handle selecting a Volume
    parent: Author | Story;             // Currently selected Author or Story
}

// Component Details ---------------------------------------------------------

const StageVolumes = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [volume, setVolume] = useState<Volume | null>(null);

    const [{performExclude, performInclude, performInsert, performRemove,
        performUpdate/*, error, processing*/}] = useMutateVolume({
        library: libraryContext.state.library,
        parent: props.parent,
    });

    useEffect(() => {

        logger.info({
            context: "StageVolumes.useEffect",
            parent: Abridgers.ANY(props.parent),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.parent]);

    const handleAdd: OnAction = () => {
        const theVolume = new Volume({
            library_id: libraryId,
        });
        logger.debug({
            context: "StageVolumes.handleAdd",
            volume: theVolume,
        });
        setVolume(theVolume);
    }

    const handleEdit: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "StageVolumes.handleEdit",
            volume: Abridgers.VOLUME(theVolume),
        })
        setVolume(theVolume);
    }

    const handleExclude: HandleVolume = async (theVolume) => {
        await performExclude(theVolume);
        props.handleRefresh();
    }

    const handleInclude: HandleVolume = async (theVolume) => {
        await performInclude(theVolume);
        props.handleRefresh();
    }

    const handleInsert: HandleVolume = async (theVolume) => {
        const inserted = await performInsert(theVolume);
        await performInclude(inserted); // Assume new Volume is included
        setVolume(null);
        props.handleRefresh();
    }

    const handlePrevious = (): void => {
        props.handleStage(Stage.PARENT);
    }

    const handleRemove: HandleVolume = async (theVolume) => {
        await performRemove(theVolume);
        setVolume(null);
        props.handleRefresh();
    }

    const handleSelect: HandleVolume = async (theVolume) => {
        logger.debug({
            context: "StageVolumes.handleSelect",
            volume: theVolume,
        });
        props.handleVolume(theVolume);
        // props.handleStage(???) - Nothing to do here???
        // props.handleRefresh()
    }

    const handleUpdate: HandleVolume = async (theVolume) => {
        await performUpdate(theVolume);
        setVolume(theVolume);
        props.handleRefresh();
    }

    // Is the specified Volume currently included for this Author/Story?
    const included = (volume: Volume): boolean => {
        let result = false;
        props.parent.volumes.forEach(includedVolume => {
            if (volume.id === includedVolume.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageVolumes">

            {/* List View */}
            {(!volume) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={false}
                                onClick={handlePrevious}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            {(props.parent instanceof Author) ? (
                                <>
                                    <span>Manage Volumes for Author:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.first_name}&nbsp;
                                        {props.parent.last_name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Manage Volumes for Story:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.name}
                                    </span>
                                </>
                            )}
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={true}
                                size="sm"
                                variant="outline-success"
                            >Next</Button>
                        </Col>
                    </Row>

                    <VolumeOptions
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
            {(volume) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(volume.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            {(props.parent instanceof Author) ? (
                                <>
                                    <span>Volume for Author:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.first_name}&nbsp;
                                        {props.parent.last_name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Volume for Story:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.name}
                                    </span>
                                </>
                            )}
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

export default StageVolumes;
