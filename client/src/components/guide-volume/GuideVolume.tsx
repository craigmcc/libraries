// GuideVolume ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import StageAuthors from "./StageAuthors";
import StageVolume from "./StageVolume";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Component Details ---------------------------------------------------------

export enum Stage {
    VOLUME,
    AUTHORS,
    STORIES,
}

export type HandleStage = (newStage: Stage) => void;

const GuideVolume = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [authors, setAuthors] = useState<Author[]>([]);
    const [pageSize] = useState<number>(25);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [stage, setStage] = useState<Stage>(Stage.VOLUME);
    const [stories, setStories] = useState<Story[]>([]);
    const [volume, setVolume] = useState<Volume>(new Volume());

    useEffect(() => {

        logger.info({
            context: "GuideVolume.useEffect",
            volume: volume,
        });
        const libraryId = libraryContext.state.library.id;

        const fetchChildren = async () => {

            setAuthors([]);
            setStories([]);

            if (loginContext.state.loggedIn && (libraryId > 0) && (volume.id > 0)) {

                try {
                    setAuthors(await VolumeClient.authors(libraryId, volume.id, {
                        limit: pageSize,
                    }));
                    setStories(await VolumeClient.stories(libraryId, volume.id, {
                        limit: pageSize,
                    }));
                } catch (error) {
                    ReportError("GuideVolume.fetchChildren", error);
                }

            }

        }

        fetchChildren();
        setRefresh(false);

    }, [libraryContext, loginContext,
            pageSize, refresh, stage, volume]);

    const calculateAuthorsKeys = (): string => {
        const keys: string[] = [];
        authors.forEach(author => {
            keys.push(`${author.last_name}, ${author.first_name}`);
        })
        return keys.join(" | ");

    }

    const calculateStoriesKeys = (): string => {
        const keys: string[] = [];
        stories.forEach(story => {
            if (story.name.length > 20) {
                keys.push(story.name.substr(0, 20) + "...");
            } else {
                keys.push(story.name);
            }
        });
        return keys.join(" | ");
    }

    const calculateVolumeKey = (): string => {
        return (volume.id > 0) ? volume.name : "";
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleVolume = (newVolume: Volume): void => {
        setVolume(newVolume);
    }

    return (
        <Container fluid id="GuideVolume">

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
                        Volume: <span className="text-info">{calculateVolumeKey()}</span>
                    </li>
                    <li>
                        Authors: <span className="text-info">{calculateAuthorsKeys()}</span>
                    </li>
                    <li>
                        Stories: <span className="text-info">{calculateStoriesKeys()}</span>
                    </li>
                </ol>
            </Row>
            <hr/>

            {(stage === Stage.VOLUME) ? (
                <StageVolume
                    handleStage={handleStage}
                    handleVolume={handleVolume}
                    volume={volume}
                />
            ) : null}

            {(stage === Stage.AUTHORS) ? (
                <StageAuthors
                    authors={authors}
                    doRefresh={() => setRefresh(true)}
                    handleStage={handleStage}
                    volume={volume}
                />
            ) : null}

        </Container>
    )

}

export default GuideVolume;
