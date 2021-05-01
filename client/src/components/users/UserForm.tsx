// UserForm ------------------------------------------------------------------

// Detail editing form for User objects.

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import {Formik,FormikHelpers,FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleUser} from "../types";
import LoginContext from "../../contexts/LoginContext";
import User from "../../models/User";
import {validateUserUsernameUnique} from "../../util/async-validators";
import {toEmptyStrings, toNullValues} from "../../util/transformations";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;            // Should the first element receive autofocus? [false]
    canRemove?: boolean;            // Can Remove be performed? [false]
    handleInsert: HandleUser;       // Handle (user) insert request
    handleRemove: HandleUser;       // Handle (user) remove request
    handleUpdate: HandleUser;       // Handle (user) update request
    user: User;                     // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const UserForm = (props: Props) => {

    const loginContext = useContext(LoginContext);

    const [adding] = useState<boolean>(props.user.id < 0);
    const [canRemove] = useState<boolean>
        (props.canRemove !== undefined ? props.canRemove : false);
    const [initialValues] = useState(toEmptyStrings(props.user));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if (adding) {
            props.handleInsert(toUser(values));
        } else {
            props.handleUpdate(toUser(values));
        }
    }

    const onConfirm = (): void => {
        setShowConfirm(true);
    }

    const onConfirmNegative = (): void => {
        setShowConfirm(false);
    }

    const onConfirmPositive = (): void => {
        setShowConfirm(false);
        props.handleRemove(props.user)
    }

    const toUser = (values: FormikValues): User => {
        const nulled = toNullValues(values);
        const result = new User({
            id: props.user.id,
            active: nulled.active,
            level: nulled.level,
            password: nulled.password,
            scope: nulled.scope,
            username: nulled.username,
        });
        if (nulled.active !== undefined) {
            result.active = nulled.active;
        }
        return result;
    }

    // NOTE - there is no server-side equivalent for this because there is
    // not an individual logged-in user performing the request
    const validateRequestedScope = (requested: string | undefined): boolean => {
        if (!requested || ("" === requested)) {
            return true;  // Not asking for scope but should be required
        } else {
            // TODO - deal with log:xxxxx pseudo-scopes
            return loginContext.validateScope(requested);
        }
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            password: Yup.string(),
            scope: Yup.string()
                .required("Scope is required")
                .test("allowed-scope",
                    "You are not allowed to assign a scope you do not possess",
                    function (value) {
                        return validateRequestedScope(value);
                    }),
            username: Yup.string()
                .required("Username is required")
                .test("unique-username",
                    "That username is already in use",
                    async function (this) {
                        return await validateUserUsernameUnique(toUser(this.parent))
                    }),
        })
    }

    return (

        <>

            {/* Details Form */}
            <Container id="userForm">

                <Formik
                    initialValues={initialValues}
                    onSubmit={(values, actions) => {
                        handleSubmit(values, actions);
                    }}
                    validateOnBlur={true}
                    validateOnChange={false}
                    validationSchema={validationSchema}
                >

                    {( {
                           errors,
                           handleBlur,
                           handleChange,
                           handleSubmit,
                           isSubmitting,
                           isValid,
                           touched,
                           values,
                       }) => (

                        <Form
                            className={"mx-auto"}
                            noValidate
                            onSubmit={handleSubmit}
                        >

                            <Form.Row id="usernameRow">
                                <Form.Group as={Row} className="mr-4"
                                            controlId="name" id="usernameGroup">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control
                                        htmlSize={25}
                                        isInvalid={touched.username && !!errors.username}
                                        isValid={!errors.username}
                                        name="username"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.username}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Username is required and must be unique.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="passwordRow">
                                <Form.Group as={Row} className="mr-4"
                                            controlId="name" id="passwordGroup">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control
                                        htmlSize={25}
                                        isInvalid={touched.password && !!errors.password}
                                        isValid={!errors.password}
                                        name="password"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.password}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Enter ONLY for a new User or if you want to
                                        change the password for an old User.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="scopeRow">
                                <Form.Group as={Row} className="mr-4"
                                            controlId="name" id="scopeGroup">
                                    <Form.Label>Scope:</Form.Label>
                                    <Form.Control
                                        htmlSize={25}
                                        isInvalid={touched.scope && !!errors.scope}
                                        isValid={!errors.scope}
                                        name="scope"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.scope}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Scope is required and sets access privileges.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.scope}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="activeRow">
                                <Form.Group as={Row} controlId="active" id="activeGroup">
                                    <Form.Check
                                        feedback={errors.active}
                                        defaultChecked={values.active}
                                        id="active"
                                        label="Active?"
                                        name="active"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
                                </Form.Group>
                            </Form.Row>

                            <Row className="mb-3">
                                <Col className="col-10">
                                    <Button
                                        disabled={isSubmitting}
                                        size="sm"
                                        type="submit"
                                        variant="primary"
                                    >
                                        Save
                                    </Button>
                                </Col>
                                <Col className="col-2 float-right">
                                    <Button
                                        disabled={adding || !canRemove}
                                        onClick={onConfirm}
                                        size="sm"
                                        type="button"
                                        variant="danger"
                                    >
                                        Remove
                                    </Button>
                                </Col>
                            </Row>

                        </Form>

                    )}

                </Formik>

            </Container>

            {/* Remove Confirm Modal */}
            <Modal
                animation={false}
                backdrop="static"
                centered
                dialogClassName="bg-danger"
                onHide={onConfirmNegative}
                show={showConfirm}
                size="lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title>WARNING:  Potential Data Loss</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>
                        Removing this User is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this User as inactive instead.</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        onClick={onConfirmPositive}
                        size="sm"
                        type="button"
                        variant="danger"
                    >
                        Remove
                    </Button>
                    <Button
                        onClick={onConfirmNegative}
                        size="sm"
                        type="button"
                        variant="primary"
                    >
                        Cancel
                    </Button>
                </Modal.Footer>
            </Modal>

        </>

    )

}

export default UserForm;
