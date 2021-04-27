// AuthorChildren ------------------------------------------------------------

// Access related child information for Authors.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs"

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";

// Incoming Properties -------------------------------------------------------

export interface Props {
    author: Author;                     // Author for which to access children
}

// Component Details ---------------------------------------------------------

const AuthorChildren = (props: Props) => {

    const [key, setKey] = useState<string | null>("Home");

    return (

        <Container fluid id="AuthorChildren">

            <Row className="justify-content-center mb-3">
                <strong>
                    <span>Related Items for Author&nbsp;</span>
                    <span className="text-info">
                        {props.author.first_name} {props.author.last_name}
                    </span>
                </strong>
            </Row>

            <Tabs
                activeKey={key}
                onSelect={(k) => setKey(k)}
            >

                <Tab eventKey="Home" title="Home">
                    <Row className="mt-3">
                        Select one of the following tabs to access
                        information related to this Author.
                    </Row>
                </Tab>

                <Tab eventKey="Series" title="Series">
                    <Row className="mt-3">
                        Series for this Author.
                    </Row>
                </Tab>

                <Tab eventKey="Stories" title="Stories">
                    <Row className="mt-3">
                        Stories for this Author.
                    </Row>
                </Tab>

                <Tab eventKey="Volumes" title="Volumes">
                    <Row className="mt-3">
                        Volumes for this Author.
                    </Row>
                </Tab>

            </Tabs>

        </Container>

    )

}

export default AuthorChildren;
