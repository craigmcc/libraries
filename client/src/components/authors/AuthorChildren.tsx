// AuthorChildren ------------------------------------------------------------

// Access related child information for Authors.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {OnChangeSelect} from "../types";
import Author from "../../models/Author";
import SeriesView from "../series/SeriesView";
import StoryView from "../stories/StoryView";
import VolumeView from "../volumes/VolumeView";

// Incoming Properties -------------------------------------------------------

export interface Props {
    author: Author;                     // Author for which to access children
}

// Component Details ---------------------------------------------------------

const AuthorChildren = (props: Props) => {

    const items = [
        "Series",
        "Stories",
        "Volumes",
    ];

    const [index, setIndex] = useState<number>(-1);

    const onChange: OnChangeSelect = (event) => {
        const newIndex = parseInt(event.target.value);
        setIndex(newIndex);
    }

    return (

        <Container fluid id="AuthorChildren">

            <Row className="ml-1 mr-1 mb-3">
                <Col className="text-left col-8">
                    <strong>
                        <span>Related Items for Author:&nbsp;</span>
                        <span className="text-info">
                            {props.author.first_name} {props.author.last_name}
                        </span>
                    </strong>
                </Col>
                <Col className="text-right">
                    <Form inline>
                        <Form.Label className="mr-2" htmlFor="itemSelector">
                            Type:
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
                <SeriesView
                    base={props.author}
                    nested={true}
                    title={`Series for Author: ${props.author.first_name} ${props.author.last_name}`}
                />
            ) : null}

            {(index === 1) ? (
                <StoryView
                    base={props.author}
                    nested={true}
                    title={`Stories for Author: ${props.author.first_name} ${props.author.last_name}`}
                />
            ) : null}

            {(index === 2) ? (
                <VolumeView
                    base={props.author}
                    nested={true}
                    title={`Volumes for Author: ${props.author.first_name} ${props.author.last_name}`}
                />
            ) : null}

        </Container>

    )

}

export default AuthorChildren;
