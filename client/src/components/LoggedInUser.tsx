// LoggedInUser ---------------------------------------------------------------

// Display information about the logged in user (if any)

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { useHistory } from "react-router-dom";

// Internal Modules ----------------------------------------------------------

import OAuthClient from "../clients/OAuthClient";
import LoginContext from "../contexts/LoginContext";
import LoginForm from "../forms/LoginForm";
import Credentials from "../models/Credentials";
import PasswordTokenRequest from "../models/PasswordTokenRequest";
import TokenResponse from "../models/TokenResponse";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";

// Component Details ---------------------------------------------------------

export const LoggedInUser = () => {

    const loginContext = useContext(LoginContext);
    const history = useHistory();

    const [showCredentials, setShowCredentials] = useState<boolean>(false);

    useEffect(() => {
        // Just trigger rerender when login or logout occurs
    }, [loginContext])

    const handleLogin = async (credentials: Credentials) => {
        const tokenRequest: PasswordTokenRequest = {
            grant_type: "password",
            password: credentials.password,
            username: credentials.username,
        }
        try {
            logger.info({
                context: "LoggedInUser.handleLogin",
                msg: "Processing credentials",
                username: credentials.username,
                password: "*REDACTED*",
            });
            const tokenResponse: TokenResponse = await OAuthClient.password(tokenRequest);
            setShowCredentials(false);
            loginContext.handleLogin(credentials.username, tokenResponse);
            logger.debug({
                context: "LoggedInUser.handleLogin",

                msg: "Successfully logged in",
                tokenResponse: JSON.stringify(tokenResponse),
            });
        } catch (error) {
            ReportError("LoggedInUser.handleLogin", error);
        }
    }

    const handleLogout = async (): Promise<void> => {
        try {
            logger.info({
                context: "LoggedInUser.handleLogout",
                msg: "Received logout click",
                access_token: `${loginContext.state.accessToken}`,
                username: `${loginContext.state.username}`,
            })
            await OAuthClient.revoke();
            logger.debug({
                context: "LoggedInUser.handleLogout",
                msg: "Revoked access token",
                access_token: `${loginContext.state.accessToken}`,
                username: `${loginContext.state.username}`,
            })
            await loginContext.handleLogout();
            logger.debug({
                context: "LoggedInUser.handleLogout",
                msg: "Updated context",
                access_token: `${loginContext.state.accessToken}`,
                username: `${loginContext.state.username}`,
            })
            history.push("/home");
        } catch (error) {
            ReportError("LoggedInUser.handleLogout", error);
        }
    }

    const onHide = () => {
        setShowCredentials(false);
    }

    const onShow = () => {
        setShowCredentials(true);
    }

    return (
        <>

            {/* Logged In Display and Controls */}
            <Form inline>
                    <Form.Label htmlFor="loggedInUsername">
                        {(loginContext.state.loggedIn) ? (
                            <Button
                                className="mr-2"
                                onClick={handleLogout}
                                size="sm"
                                type="button"
                                variant="outline-dark"
                            >
                                Log Out
                            </Button>
                        ) : (
                            <Button
                                className="mr-2"
                                onClick={onShow}
                                size="sm"
                                type="button"
                                variant="outline-dark"
                            >
                                Log In
                            </Button>
                        )}
{/*
                        <span className="ml-1 mr-1">User:</span>
*/}
                    </Form.Label>
                    <Form.Control
                        htmlSize={12}
                        id="loggedInUsername"
                        readOnly={true}
                        size="sm"
                        value={loginContext.state.username ? loginContext.state.username : "-----"}
                    />

            </Form>

            {/* Login Credentials Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                onHide={onHide}
                show={showCredentials}
                size="sm"
            >
                <Modal.Header closeButton>
                    <Modal.Title>Enter Credentials</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <LoginForm autoFocus handleLogin={handleLogin}/>
                </Modal.Body>
            </Modal>

        </>
    )

}

export default LoggedInUser;
