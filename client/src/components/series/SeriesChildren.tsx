// SeriesChildren ------------------------------------------------------------

// Access related child information for Series.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {OnChangeSelect} from "../types";
import AuthorView from "../authors/AuthorView";
import StoryView from "../stories/StoryView";
import Series from "../../models/Series";

// Incoming Properties -------------------------------------------------------

export interface Props {
    series: Series;                     // Series for which to access children
}

// Component Details ---------------------------------------------------------

const SeriesChildren = (props: Props) => {

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

        <Container fluid id="SeriesChildren">

            <Row className="ml-1 mr-1 mb-3">
                <Col className="text-left col-8">
                    <strong>
                        <span>Related Items for Series:&nbsp;</span>
                        <span className="text-info">{props.series.name}</span>
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
                <AuthorView
                    base={props.series}
                    nested={true}
                    title={`Authors for Series: ${props.series.name}`}
                />
            ) : null}

            {(index === 1) ? (
                <StoryView
                    base={props.series}
                    nested={true}
                    title={`Stories for Series: ${props.series.name}`}
                />
            ) : null}

        </Container>

    )

}

export default SeriesChildren;
