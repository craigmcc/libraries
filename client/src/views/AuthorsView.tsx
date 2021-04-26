// AuthorsView -------------------------------------------------------------

// Administrator view for editing Authors.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import {HandleAuthor, HandleAuthorOptional, Scopes} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import AuthorForm from "../forms/AuthorForm";
import Author from "../models/Author";
import AuthorsSubview from "../subviews/AuthorsSubview";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";

// Component Details ---------------------------------------------------------

const AuthorsView = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [libraryId, setLibraryId] = useState<number>(-1);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [author, setAuthor] = useState<Author | null>(null);

    useEffect(() => {

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

    }, [libraryContext, loginContext, refresh]);

    const handleInsert: HandleAuthor = async (newAuthor) => {
        try {
            newAuthor.library_id = libraryId;
            const inserted: Author = await AuthorClient.insert(libraryId, newAuthor);
            setRefresh(true);
            setAuthor(null);
            logger.trace({
                context: "AuthorsView.handleInsert",
                author: Abridgers.AUTHOR(inserted),
            });
        } catch (error) {
            ReportError("AuthorsView.handleInsert", error);
        }
    }

    const handleRemove: HandleAuthor = async (newAuthor) => {
        try {
            const removed: Author = await AuthorClient.remove(libraryId, newAuthor.id);
            setRefresh(true);
            setAuthor(null);
            logger.trace({
                context: "AuthorsView.handleRemove",
                author: Abridgers.AUTHOR(removed),
            });
        } catch (error) {
            ReportError("AuthorsView.handleRemove", error);
        }
    }

    const handleSelect: HandleAuthorOptional = (newAuthor) => {
        if (newAuthor) {
            if (canEdit) {
                setAuthor(newAuthor);
            }
            logger.trace({
                context: "AuthorsView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                author: Abridgers.AUTHOR(newAuthor),
            });
        } else {
            setAuthor(null);
            logger.trace({
                context: "AuthorsView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleAuthor = async (newAuthor) => {
        try {
            const updated: Author =
                await AuthorClient.update(libraryId, newAuthor.id, newAuthor);
            setRefresh(true);
            setAuthor(null);
            logger.trace({
                context: "AuthorsView.handleUpdate",
                author: Abridgers.AUTHOR(updated),
            });
        } catch (error) {
            ReportError("AuthorsView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newAuthor: Author = new Author({
            library_id: libraryId,
        });
        setAuthor(newAuthor);
        logger.trace({
            context: "AuthorsView.onAdd",
            author: newAuthor
        });
    }

    const onBack = () => {
        setAuthor(null);
        logger.trace({
            context: "AuthorsView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="AuthorsView">

                {/* List View */}
                {(!author) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <AuthorsSubview
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

                {(author) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(author.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;Author for Library&nbsp;
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
                            <AuthorForm
                                autoFocus
                                canRemove={canRemove}
                                handleInsert={handleInsert}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                                author={author}
                            />
                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default AuthorsView;
