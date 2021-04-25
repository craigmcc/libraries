// UsersView -----------------------------------------------------------------

// Administrator view for editing Users.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import UserClient from "../clients/UserClient";
import {HandleUser, HandleUserOptional, Scopes} from "../components/types";
import LoginContext from "../contexts/LoginContext";
import UserForm from "../forms/UserForm";
import User from "../models/User";
import UsersSubview from "../subviews/UsersSubview";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";

// Component Details ---------------------------------------------------------

const UsersView = () => {

    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [user, setUser] = useState<User | null>(null);

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

    const handleInsert: HandleUser = async (newUser) => {
        try {
            const inserted: User = await UserClient.insert(newUser);
            setRefresh(true);
            setUser(null);
            logger.debug({
                context: "UsersView.handleInsert",
                user: Abridgers.USER(inserted),
            });
        } catch (error) {
            ReportError("UsersView.handleInsert", error);
        }
    }

    const handleRemove: HandleUser = async (newUser) => {
        try {
            const removed: User = await UserClient.remove(newUser.id);
            setRefresh(true);
            setUser(null);
            logger.debug({
                context: "UsersView.handleRemove",
                user: Abridgers.USER(removed),
            });
        } catch (error) {
            ReportError("UsersView.handleRemove", error);
        }
    }

    const handleSelect: HandleUserOptional = (newUser) => {
        if (newUser) {
            if (canEdit) {
                setUser(newUser);
            }
            logger.debug({
                context: "UsersView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                user: Abridgers.USER(newUser),
            });
        } else {
            setUser(null);
            logger.debug({
                context: "UsersView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleUser = async (newUser) => {
        try {
            const updated: User = await UserClient.update(newUser.id, newUser);
            setRefresh(true);
            setUser(null);
            logger.debug({
                context: "UsersView.handleUpdate",
                user: Abridgers.USER(updated),
            });
        } catch (error) {
            ReportError("UsersView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newUser: User = new User();
        setUser(newUser);
        logger.debug({
            context: "UsersView.onAdd",
            user: newUser
        });
    }

    const onBack = () => {
        setUser(null);
        logger.debug({
            context: "UsersView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="UsersView">

                {/* List View */}
                {(!user) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <UsersSubview
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

                {(user) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <Col className="text-left">
                                <strong>
                                    <>
                                        {(user.id < 0) ? (
                                            <span>Adding New</span>
                                        ) : (
                                            <span>Editing Existing</span>
                                        )}
                                        &nbsp;User
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
                            <UserForm
                                autoFocus
                                canRemove={canRemove}
                                handleInsert={handleInsert}
                                handleRemove={handleRemove}
                                handleUpdate={handleUpdate}
                                user={user}
                            />
                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default UsersView;
