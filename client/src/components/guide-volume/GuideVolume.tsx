// GuideVolume ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import StageAuthors from "./StageAuthors";
import StageStories from "./StageStories";
import StageVolume from "./StageVolume";
import VolumeSummary from "./VolumeSummary";
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

    const handleRefresh = (): void => {
        setRefresh(true);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleVolume = (newVolume: Volume): void => {
        setVolume(newVolume);
        setStage(Stage.AUTHORS);    // Implicitly advance after Volume selected
    }

    return (
        <Container fluid id="GuideVolume">

            <VolumeSummary
                authors={authors}
                stories={stories}
                volume={volume}
            />
            <hr color="cyan"/>

            {(stage === Stage.VOLUME) ? (
                <StageVolume
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleVolume={handleVolume}
                    volume={volume}
                />
            ) : null}

            {(stage === Stage.AUTHORS) ? (
                <StageAuthors
                    authors={authors}
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    volume={volume}
                />
            ) : null}

            {(stage === Stage.STORIES) ? (
                <StageStories
                    authors={authors}
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    stories={stories}
                    volume={volume}
                />
            ) : null}

        </Container>
    )

}

export default GuideVolume;
