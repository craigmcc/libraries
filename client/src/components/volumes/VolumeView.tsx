// VolumesView -------------------------------------------------------------

// Administrator view for editing Volumes.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import VolumeChildren from "./VolumeChildren";
import VolumeClient from "../../clients/VolumeClient";
import {HandleVolume, HandleVolumeOptional, Scopes} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import VolumeForm from "./VolumeForm";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import VolumeList from "./VolumeList";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    base?: Author | Story;              // Parent object to select for [Library]
    nested?: boolean;                   // Show nested child list? [false]
    title?: string;                     // Table title [Volumes for Library: XXXXX]
}

// Component Details ---------------------------------------------------------

const VolumeView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [libraryId, setLibraryId] = useState<number>(-1);
    const [nested] = useState<boolean>((props.nested !== undefined)
        ? props.nested : false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [volume, setVolume] = useState<Volume | null>(null);

    useEffect(() => {

        logger.info({
            context: "VolumesView.useEffect",
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

    const handleInsert: HandleVolume = async (newVolume) => {
        try {
            newVolume.library_id = libraryId;
            const inserted: Volume = await VolumeClient.insert(libraryId, newVolume);
            setRefresh(true);
            setVolume(null);
            logger.trace({
                context: "VolumesView.handleInsert",
                volume: Abridgers.VOLUME(inserted),
            });
        } catch (error) {
            ReportError("VolumesView.handleInsert", error);
        }
    }

    const handleRemove: HandleVolume = async (newVolume) => {
        try {
            const removed: Volume = await VolumeClient.remove(libraryId, newVolume.id);
            setRefresh(true);
            setVolume(null);
            logger.trace({
                context: "VolumesView.handleRemove",
                volume: Abridgers.VOLUME(removed),
            });
        } catch (error) {
            ReportError("VolumesView.handleRemove", error);
        }
    }

    const handleSelect: HandleVolumeOptional = (newVolume) => {
        if (newVolume) {
            if (canEdit) {
                setVolume(newVolume);
            }
            logger.trace({
                context: "VolumesView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                volume: Abridgers.VOLUME(newVolume),
            });
        } else {
            setVolume(null);
            logger.trace({
                context: "VolumesView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleVolume = async (newVolume) => {
        try {
            const updated: Volume =
                await VolumeClient.update(libraryId, newVolume.id, newVolume);
            setRefresh(true);
            setVolume(null);
            logger.trace({
                context: "VolumesView.handleUpdate",
                volume: Abridgers.VOLUME(updated),
            });
        } catch (error) {
            ReportError("VolumesView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newVolume: Volume = new Volume({
            library_id: libraryId,
        });
        setVolume(newVolume);
        logger.trace({
            context: "VolumesView.onAdd",
            volume: newVolume
        });
    }

    const onBack = () => {
        setVolume(null);
        logger.trace({
            context: "VolumesView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="VolumeView">

                {/* List View */}
                {(!volume) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <VolumeList
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

                {(volume) ? (

                    <>

                        <Row id="VolumeDetails" className="mr-1">

                            <Col id="VolumeFormView">

                                <Row className="ml-1 mr-1 mb-3">
                                    <Col className="text-center col-8">
                                        <strong>
                                            <>
                                                {(volume.id < 0) ? (
                                                    <span>Adding New</span>
                                                ) : (
                                                    <span>Editing Existing</span>
                                                )}
                                                &nbsp;Volume for Library:&nbsp;
                                                <span className="text-info">
                                                    {libraryContext.state.library.name}
                                                </span>
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
                                    <VolumeForm
                                        autoFocus
                                        canRemove={canRemove}
                                        handleInsert={handleInsert}
                                        handleRemove={handleRemove}
                                        handleUpdate={handleUpdate}
                                        volume={volume}
                                    />
                                </Row>

                            </Col>

                            {((volume.id > 0) && !nested) ? (
                                <Col id="volumeChildren" className="bg-light">
                                    <VolumeChildren
                                        volume={volume}
                                    />
                                </Col>
                            ) : null }

                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default VolumeView;
