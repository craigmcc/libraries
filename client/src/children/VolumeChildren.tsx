// VolumeChildren ------------------------------------------------------------

// Access related child information for Volumes.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

// Internal Modules ----------------------------------------------------------

import Volume from "../models/Volume";
import AuthorsView from "../views/AuthorsView";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {OnChangeSelect} from "../components/types";

// Incoming Properties -------------------------------------------------------

export interface Props {
    volume: Volume;                     // Volume for which to access children
}

// Component Details ---------------------------------------------------------

const VolumeChildren = (props: Props) => {

    const items = [
        "Authors",
        "Stories",
    ];

    const [index, setIndex] = useState<number>(-1);

    const onChange: OnChangeSelect = (event) => {
        const newIndex = parseInt(event.target.value);
        setIndex(newIndex);
    }

    return (

        <Container fluid id="VolumeChildren">

            <Row className="ml-1 mr-1 mb-3">
                <Col className="text-left">
                    <strong>
                        <span>Related Items for Volume:&nbsp;</span>
                        <span className="text-info">{props.volume.name}</span>
                    </strong>
                </Col>
                <Col className="text-right">
                    <Form inline>
                        <Form.Label className="mr-2" htmlFor="itemSelector">
                            Item:
                        </Form.Label>
                        <Form.Control
                            as="select"
                            autoFocus={true}
                            id="itemSelector"
                            onChange={onChange}
                            size="sm"
                            value={index}
                        >
                            <option key="-1" value="-1">(Select)</option>
                            {items.map((item, index) => (
                                <option key={index} value={index}>{item}</option>
                            ))}
                        </Form.Control>
                    </Form>
                </Col>
            </Row>

            {(index === 0) ? (
                <AuthorsView
                    base={props.volume}
                    nested={true}
                    title={`Authors for Volume: ${props.volume.name}`}
                />
            ) : null}

            {(index === 1) ? (
                <span>Stories</span>
            ) : null}

        </Container>

    )

}

export default VolumeChildren;
