// LibrariesView -------------------------------------------------------------

// Administrator view for editing Libraries.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LibraryForm from "./LibraryForm";
import LibraryList from "./LibraryList";
import {HandleLibrary, HandleLibraryOptional, Scopes} from "../types";
import LibraryClient from "../../clients/LibraryClient";
import LoginContext from "../../contexts/LoginContext";
import Library from "../../models/Library";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

const LibraryView = () => {

    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [library, setLibrary] = useState<Library | null>(null);

    useEffect(() => {

        // Record current permissions
        const isSuperuser = loginContext.validateScope(Scopes.SUPERUSER);
        setCanAdd(isSuperuser);
        setCanEdit(isSuperuser);
        setCanRemove(isSuperuser);

        // Reset refresh flag if set
        if (refresh) {
            setRefresh(false);
        }

    }, [loginContext, refresh]);

    const handleInsert: HandleLibrary = async (newLibrary) => {
        try {
            const inserted: Library = await LibraryClient.insert(newLibrary);
            setRefresh(true);
            setLibrary(null);
            logger.trace({
                context: "LibrariesView.handleInsert",
                library: Abridgers.LIBRARY(inserted),
            });
        } catch (error) {
            ReportError("LibrariesView.handleInsert", error);
        }
    }

    const handleRemove: HandleLibrary = async (newLibrary) => {
        try {
            const removed: Library = await LibraryClient.remove(newLibrary.id);
            setRefresh(true);
            setLibrary(null);
            logger.trace({
                context: "LibrariesView.handleRemove",
                library: Abridgers.LIBRARY(removed),
            });
        } catch (error) {
            ReportError("LibrariesView.handleRemove", error);
        }
    }

    const handleSelect: HandleLibraryOptional = (newLibrary) => {
        if (newLibrary) {
            if (canEdit) {
                setLibrary(newLibrary);
            }
            logger.trace({
                context: "LibrariesView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                library: Abridgers.LIBRARY(newLibrary),
            });
        } else {
            setLibrary(null);
            logger.trace({
                context: "LibrariesView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleLibrary = async (newLibrary) => {
        try {
            const updated: Library = await LibraryClient.update(newLibrary.id, newLibrary);
            setRefresh(true);
            setLibrary(null);
            logger.trace({
                context: "LibrariesView.handleUpdate",
                library: Abridgers.LIBRARY(updated),
            });
        } catch (error) {
            ReportError("LibrariesView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newLibrary: Library = new Library();
        setLibrary(newLibrary);
        logger.trace({
            context: "LibrariesView.onAdd",
            library: newLibrary
        });
    }

    const onBack = () => {
        setLibrary(null);
        logger.trace({
            context: "LibrariesView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="LibrariesView">

                {/* List View */}
                {(!library) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <LibraryList
                                handleSelect={handleSelect}
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

                {(library) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(library.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;Library
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
                            <LibraryForm
                                autoFocus
                                canRemove={canRemove}
                                handleInsert={handleInsert}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                                library={library}
                            />
                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default LibraryView;
