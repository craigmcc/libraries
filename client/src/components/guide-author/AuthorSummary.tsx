// AuthorSummary -------------------------------------------------------------

// Render a summary of the currently selected Author.

// External Modules ----------------------------------------------------------

import React, {useEffect} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import Author from "../../models/Author";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    author: Author;                     // Currently selected Author
}

// Component Details ---------------------------------------------------------

const AuthorSummary = (props: Props) => {

    useEffect(() => {
        logger.info({
            context: "AuthorSummary.useEffect",
            author: Abridgers.AUTHOR(props.author),
        });
    }, [props.author]);

    return (
        <Container fluid id="AuthorSummary">
            <Row className="mb-1">
                <Col className="text-center">
                    <span>Summary for Author:&nbsp;</span>
                    {(props.author.id > 0) ? (
                        <span className="text-info">
                            {props.author.first_name}&nbsp;
                            {props.author.last_name}&nbsp;&nbsp;
                        </span>
                    ) : (
                        <span>(Please Select)</span>
                    )}
                </Col>
            </Row>
        </Container>
    )

}

export default AuthorSummary;
