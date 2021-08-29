// StorySummary -------------------------------------------------------------

// Render a summary of the currently selected Story and its associated
// currently selected Authors, Series, and Volumes.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import Story from "../../models/Story";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import {authorsKeys} from "../../util/transformations";

// Incoming Properties ------------------------------------------------------

export interface Props {
    story: Story;                       // Currently selected Story
}

// Component Details --------------------------------------------------------

const StorySummary = (props: Props) => {

    useEffect(() => {

        logger.info({
            context: "StorySummary.useEffect",
            series: Abridgers.STORY(props.story),
        });

    }, [props.story]);

    return (
        <Container fluid id="StorySummary">
            <Row className="mb-1">
                <Col className="text-center">
                    <span>Summary for Story:&nbsp;</span>
                    <span className="text-info">
                        {props.story.name}&nbsp;&nbsp;
                    </span>
                </Col>
            </Row>
            <Row className="mb-3">
                <Col className="text-center">
                    <span>Story Authors:&nbsp;</span>
                    <span className="text-info">
                                {authorsKeys(props.story.authors)}
                            </span>
                </Col>
            </Row>
        </Container>
    )

}

export default StorySummary;
