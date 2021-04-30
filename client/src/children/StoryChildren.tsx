// StoryChildren ------------------------------------------------------------

// Access related child information for Storyies.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {OnChangeSelect} from "../components/types";
import Story from "../models/Story";
import AuthorsView from "../views/AuthorsView";
import VolumesView from "../views/VolumesView";

// Incoming Properties -------------------------------------------------------

export interface Props {
    story: Story;                     // Story for which to access children
}

// Component Details ---------------------------------------------------------

const StoryChildren = (props: Props) => {

    const items = [
        "Authors",
        "Volumes",
    ];

    const [index, setIndex] = useState<number>(-1);

    const onChange: OnChangeSelect = (event) => {
        const newIndex = parseInt(event.target.value);
        setIndex(newIndex);
    }

    return (

        <Container fluid id="StoryChildren">

            <Row className="ml-1 mr-1 mb-3">
                <Col className="text-left col-8">
                    <strong>
                        <span>Related Items for Story:&nbsp;</span>
                        <span className="text-info">{props.story.name}</span>
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
                <AuthorsView
                    base={props.story}
                    nested={true}
                    title={`Authors for Story: ${props.story.name}`}
                />
            ) : null}

            {(index === 1) ? (
                <VolumesView
                    base={props.story}
                    nested={true}
                    title={`Stories for Story: ${props.story.name}`}
                />
            ) : null}

        </Container>

    )

}

export default StoryChildren;
