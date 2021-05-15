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

    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [stage, setStage] = useState<Stage>(Stage.VOLUME);
    const [volume, setVolume] = useState<Volume>(new Volume());
    const [volumeId, setVolumeId] = useState<number>(-1);

    useEffect(() => {

        const fetchVolume = async () => {

            logger.info({
                context: "GuideVolume.fetchVolume",
                msg: "Input conditions",
                refresh: refresh,
                volumeId: volumeId,
                volume: volume,
            });

            if (loginContext.state.loggedIn) {
                if ((libraryId > 0) && (volumeId > 0)) {
                    if ((volumeId !== volume.id) || refresh) {
                        try {
                            const newVolume = await VolumeClient.find(libraryId, volumeId, {
                                withAuthors: "",
                                withStories: "",
                            });
                            logger.info({
                                context: "GuideVolume.fetchVolume",
                                msg: "Fetch updated Volume",
                                volume: newVolume,
                            });
                            setVolume(newVolume);
                            if (stage === Stage.VOLUME) {
                                setStage(Stage.AUTHORS); // Implicitly advance after Volume selected
                            }
                        } catch (error) {
                            ReportError("GuideVolume.fetchVolume", error);
                        }
                    } else {
                        logger.info({
                            context: "GuideVolume.fetchVolume",
                            msg: "Logged in, same Volume or not refresh - skip"
                        });
                    }
                } else {
                    logger.info({
                        context: "GuideVolume.fetchVolume",
                        msg: "Logged in, not refresh, missing libraryId/volumeId - skip",
                    });
                }
            } else {
                logger.info({
                    context: "GuideVolume.fetchVolume",
                    msg: "Not logged in, revert",
                });
                if (volume.id > 0) {
                    setVolume(new Volume());
                }
                if (volumeId > 0) {
                    setVolumeId(-1);
                }
            }

            if (refresh) {
                setRefresh(false);
            }

        }

        fetchVolume();

    }, [libraryContext, loginContext,
              libraryId, refresh, stage, volume, volumeId]);

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideVolume.handleRefresh",
            volumeId: volume.id,
            volume: volume,
        });
        setRefresh(true);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleVolume = async (newVolume: Volume): Promise<void> => {
        logger.info({
            context: "GuideVolume.handleVolume",
            volume: newVolume,
        });
//        setRefresh(true);
        setVolumeId(newVolume.id);  // Trigger (re)fetch of the specified Volume
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
