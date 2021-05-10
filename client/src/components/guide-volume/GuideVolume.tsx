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
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";

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

    const [pageSize] = useState<number>(25);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [stage, setStage] = useState<Stage>(Stage.VOLUME);
    const [volume, setVolume] = useState<Volume>(new Volume());

    useEffect(() => {

        logger.info({
            context: "GuideVolume.useEffect",
        });
        setRefresh(false);

    }, [libraryContext, loginContext,
            pageSize, refresh, stage, volume]);

    const handleRefresh = (): void => {
        setRefresh(true);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleVolume = async (newVolume: Volume): Promise<void> => {
        if (newVolume.id > 0) {
            const updatedVolume = await VolumeClient.find
                (newVolume.library_id, newVolume.id, {
                    withAuthors: "",
                    withStories: "",
                });
            logger.info({
                context: "GuideVolume.handleVolume",
                msg: "Switch to new expanded Volume",
                volume: updatedVolume,
            });
            setVolume(updatedVolume);
            setStage(Stage.AUTHORS); // Implicitly advance after Volume selected
        } else {
            setVolume(newVolume);
        }
    }

    return (
        <Container fluid id="GuideVolume">

            <VolumeSummary
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
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    volume={volume}
                />
            ) : null}

            {(stage === Stage.STORIES) ? (
                <StageStories
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    volume={volume}
                />
            ) : null}

        </Container>
    )

}

export default GuideVolume;
