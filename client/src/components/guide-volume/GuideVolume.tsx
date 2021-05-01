// GuideVolume ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";

// Component Details ---------------------------------------------------------

const GuideVolume = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [volume, setVolume] = useState<Volume>(new Volume());

    const handleVolume = (newVolume: Volume): void => {
        setVolume(newVolume);
    }

    return (
        <Container fluid id="VolumeGuide">

            {/* Header and Object Summary */}
            <Row className="ml-1 mr-1">
                <Col className="text-center">
                    <span>
                        Step-by-step guide to managing library information,
                        starting from a <strong>Volume</strong>.
                    </span>
                </Col>
            </Row>
            <hr/>
            <Row className="ml-1 mr-1">
                <ol>
                    <li>
                        Volume: {(volume.id > 0)
                            ? <span className="text-info">{volume.name}</span>
                            : null}
                    </li>
                </ol>
            </Row>
            <hr/>

            {/* TODO - see if this works as a Modal */}

        </Container>
    )

}

export default GuideVolume;
