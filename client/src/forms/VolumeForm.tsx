// VolumeForm ---------------------------------------------------------------

// Detail editing form for Volume objects.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import {Formik,FormikHelpers,FormikValues} from "formik";
import Button from "react-bootstrap/button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import * as Yup from "yup";

// Internal Modules ----------------------------------------------------------

import {HandleVolume} from "../components/types";
import Volume from "../models/Volume";
//import {toVolume} from "../util/to-model-types";
import {toEmptyStrings, toNullValues} from "../util/transformations";

// Property Details ----------------------------------------------------------

export interface Props {
    autoFocus?: boolean;            // Should the first element receive autofocus? [false]
    canRemove?: boolean;            // Can Remove be performed? [false]
    handleInsert: HandleVolume;     // Handle (Volume) insert request
    handleRemove: HandleVolume;     // Handle (Volume) remove request
    handleUpdate: HandleVolume;     // Handle (Volume) update request
    volume: Volume;                 // Initial values (id<0 for adding)
}

// Component Details ---------------------------------------------------------

const VolumeForm = (props: Props) => {

    const [adding] = useState<boolean>(props.volume.id < 0);
    const [canRemove] = useState<boolean>
        (props.canRemove !== undefined ? props.canRemove : false);
    const [initialValues] = useState(toEmptyStrings(props.volume));
    const [showConfirm, setShowConfirm] = useState<boolean>(false);

    const handleSubmit = (values: FormikValues, actions: FormikHelpers<FormikValues>): void => {
        if (adding) {
            props.handleInsert(toVolume1(values));
        } else {
            props.handleUpdate(toVolume1(values));
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
        props.handleRemove(props.volume)
    }

    const toVolume1 = (values: FormikValues): Volume => {
        const nulled = toNullValues(values);
        const result = new Volume({
            active: nulled.active,
            copyright: nulled.copyright,
            google_id: nulled.google_id,
            id: props.volume.id,
            isbn: nulled.isbn,
            library_id: props.volume.library_id,
            media: nulled.media,
            name: nulled.name,
            notes: nulled.notes,
            read: nulled.read,
        });
        if (nulled.active !== undefined) {
            result.active = nulled.active;
        }
        if (nulled.read !== undefined) {
            result.read = nulled.read;
        }
        return result;
    }

    const validationSchema = () => {
        return Yup.object().shape({
            active: Yup.boolean(),
            name: Yup.string()
                .required("Name is required"),
        });
    }

    return (

        <>

            {/* Details Form */}
            <Container id="VolumeForm">

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

                            <Form.Row id="nameRow">
                                <Form.Group as={Row} className="mr-4"
                                            controlId="name" id="nameGroup">
                                    <Form.Label>Name:</Form.Label>
                                    <Form.Control
                                        htmlSize={25}
                                        isInvalid={touched.name && !!errors.name}
                                        isValid={!errors.name}
                                        name="name"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.name}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Name is required and might not be unique.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.name}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="copyrightGoogleIdRow">
                                <Form.Group as={Col} className="mr-4"
                                            controlId="copyright" id="copyrightGroup">
                                    <Form.Label>Copyright Year:</Form.Label>
                                    <Form.Control
                                        htmlSize={8}
                                        isInvalid={touched.copyright && !!errors.copyright}
                                        isValid={!errors.copyright}
                                        name="copyright"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.copyright}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Copyright year (YYYY) for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.copyright}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} className="mr-4"
                                            controlId="google_id" id="googleIdGroup">
                                    <Form.Label>Google Books ID:</Form.Label>
                                    <Form.Control
                                        htmlSize={16}
                                        isInvalid={touched.google_id && !!errors.google_id}
                                        isValid={!errors.google_id}
                                        name="google_id"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.google_id}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Google Books unique identifier for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.google_id}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="isbnLocationRow">
                                <Form.Group as={Col} className="mr-4"
                                            controlId="isbn" id="isbnGroup">
                                    <Form.Label>ISBN ID:</Form.Label>
                                    <Form.Control
                                        htmlSize={16}
                                        isInvalid={touched.isbn && !!errors.isbn}
                                        isValid={!errors.isbn}
                                        name="isbn"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.isbn}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        International Standard Book Number for this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.isbn}
                                    </Form.Control.Feedback>
                                </Form.Group>
                                <Form.Group as={Col} className="mr-4"
                                            controlId="location" id="locationGroup">
                                    <Form.Label>Volume Location:</Form.Label>
                                    <Form.Control
                                        htmlSize={8}
                                        isInvalid={touched.location && !!errors.location}
                                        isValid={!errors.location}
                                        name="location"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.location}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Physical location of this volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.location}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="notesRow">
                                <Form.Group as={Row} className="mr-4"
                                            controlId="notes" id="notesGroup">
                                    <Form.Label>Notes:</Form.Label>
                                    <Form.Control
                                        htmlSize={25}
                                        isInvalid={touched.notes && !!errors.notes}
                                        isValid={!errors.notes}
                                        name="notes"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                        size="sm"
                                        type="text"
                                        value={values.notes}
                                    />
                                    <Form.Control.Feedback type="valid">
                                        Miscellaneous notes about this Volume.
                                    </Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                        {errors.notes}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row id="readRow">
                                <Form.Group as={Row} controlId="read" id="readGroup">
                                    <Form.Check
                                        feedback={errors.read}
                                        defaultChecked={values.read}
                                        id="read"
                                        label="Already Read?"
                                        name="read"
                                        onBlur={handleBlur}
                                        onChange={handleChange}
                                    />
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
                        Removing this Volume is not reversible, and
                        <strong>
                            &nbsp;will also remove ALL related information.
                        </strong>.
                    </p>
                    <p>Consider marking this Volume as inactive instead.</p>
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

export default VolumeForm;
