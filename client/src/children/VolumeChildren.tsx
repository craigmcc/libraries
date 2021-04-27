// VolumeChildren ------------------------------------------------------------

// Access related child information for Volumes.

// External Modules ----------------------------------------------------------

import React, {useState} from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs"

// Internal Modules ----------------------------------------------------------

import Volume from "../models/Volume";
import AuthorsView from "../views/AuthorsView";

// Incoming Properties -------------------------------------------------------

export interface Props {
    volume: Volume;                     // Volume for which to access children
}

// Component Details ---------------------------------------------------------

const VolumeChildren = (props: Props) => {

    const [key, setKey] = useState<string | null>("Home");

    return (

        <Container fluid id="VolumeChildren">

            <Row className="justify-content-center mb-3">
                <strong>
                    <span>Related Items for Volume:&nbsp;</span>
                    <span className="text-info">
                        {props.volume.name}
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
                        information related to this Volume.
                    </Row>
                </Tab>

                <Tab eventKey="Authors" title="Authors">
                    <Row className="mt-3">
                        <AuthorsView
                            base={props.volume}
                            nested={true}
                            title={`Authors for Volume: ${props.volume.name}`}
                        />
                    </Row>
                </Tab>

                <Tab eventKey="Stories" title="Stories">
                    <Row className="mt-3">
                        Stories for this Volume.
                    </Row>
                </Tab>

            </Tabs>

        </Container>

    )

}

export default VolumeChildren;
