// GuideVolume ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import StageAuthors from "./StageAuthors";
import StageVolume from "./StageVolume";
import VolumeSummary from "./VolumeSummary";
import { Stage } from "../guide-shared/Stage";
import StageStories from "../guide-shared/StageStories";
import StageWriters from "../guide-shared/StageWriters";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import StoryClient from "../../clients/StoryClient";

// Component Details ---------------------------------------------------------

const GuideVolume = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [stage, setStage] = useState<Stage>(Stage.PARENT);
    const [story, setStory] = useState<Story>(new Story());
    const [storyId, setStoryId] = useState<number>(-1);
    const [volume, setVolume] = useState<Volume>(new Volume());
    const [volumeId, setVolumeId] = useState<number>(-1);

    useEffect(() => {

        const fetchVolume = async () => {

            logger.debug({
                context: "GuideVolume.fetchVolume",
                msg: "Input conditions",
                libraryId: libraryId,
                volumeId: volumeId,
                volume: volume,
            });

            if (loginContext.state.loggedIn) {
                if (libraryId > 0) {
                    if (volumeId > 0) {
                        logger.debug({
                            context: "GuideVolume.fetchVolume",
                            msg: "Fetch requested Volume",
                            volumeId: volumeId,
                        });
                        try {
                            const newVolume = await VolumeClient.find(libraryId, volumeId, {
                                withAuthors: "",
                                withStories: "",
                            });
                            newVolume.authors = sortAuthors(newVolume.authors);
                            newVolume.stories = newVolume.stories.sort(function (a, b) {
                                if (a.ordinal === null) {
                                    return (b.ordinal === null ? 0 : -1);
                                } else if (b.ordinal === null) {
                                    return 1;
                                } else {
                                    return a.ordinal - b.ordinal;
                                }
                            });
                            for (const story of newVolume.stories) {
                                story.authors = await StoryClient.authors(libraryId, story.id);
                            }
                            logger.info({
                                context: "GuideVolume.fetchVolume",
                                msg: "Fleshed out Volume",
                                volume: newVolume,
                            });
                            setVolume(newVolume);
                            setVolumeId(-1);
                        } catch (error) {
                            ReportError("GuideVolume.fetchVolume", error);
                            setVolume(new Volume());
                            setVolumeId(-1);
                        }
                    } else {
                        logger.debug({
                            context: "GuideVolume.fetchVolume",
                            msg: "No new volumeId - keep existing",
                        });
                    }
                } else {
                    logger.debug({
                        context: "GuideVolume.fetchVolume",
                        msg: "No libraryId - reset",
                    });
                    if (volume.id > 0) {
                        setVolume(new Volume());
                    }
                    if (volumeId > 0) {
                        setVolumeId(-1);
                    }
                }
            } else {
                logger.debug({
                    context: "GuideVolume.fetchVolume",
                    msg: "Not logged in - reset",
                });
                if (volume.id > 0) {
                    setVolume(new Volume());
                }
                if (volumeId > 0) {
                    setVolumeId(-1);
                }
            }

        }

        fetchVolume();

    }, [libraryContext.state.library.id, loginContext.state.loggedIn,
              libraryId, stage, volume, volumeId]);

    useEffect(() => {

        const fetchStory = async () => {

            logger.debug({
                context: "GuideVolume.fetchStory",
                msg: "Input conditions",
                libraryId: libraryId,
                storyId: storyId,
                story: story,
            });

            if (loginContext.state.loggedIn) {
                if (libraryId > 0) {
                    if (storyId > 0) {
                        try {
                            const newStory = await StoryClient.find(libraryId, storyId, {
                                withAuthors: "",
                            });
                            newStory.authors = sortAuthors(newStory.authors);
                            logger.info({
                                context: "GuideVolume.fetchStory",
                                msg: "Fleshed out Story",
                                story: newStory,
                            });
                            setStory(newStory);
                            if (stage === Stage.STORIES) {
                                setStage(Stage.WRITERS); // Implicitly advance after Story selected
                            }
                            setStoryId(-1);
                        } catch (error) {
                            ReportError("GuideVolume.fetchStory", error);
                            setStory(new Story());
                            setStoryId(-1);
                        }
                    } else {
                        logger.debug({
                            context: "GuideVolume.fetchStory",
                            msg: "No new storyId - keep existing",
                        });
                    }
                } else {
                    logger.debug({
                        context: "GuideVolume.fetchStory",
                        msg: "No libraryId - reset",
                    });
                    if (story.id > 0) {
                        setStory(new Story());
                    }
                    if (storyId > 0) {
                        setStoryId(-1);
                    }
                }
            } else {
                logger.debug({
                    context: "GuideVolume.fetchStory",
                    msg: "Not logged in - reset",
                });
                if (story.id > 0) {
                    setStory(new Story());
                }
                if (storyId > 0) {
                    setStoryId(-1);
                }
            }

        }

        fetchStory();

    }, [libraryContext.state.library.id, loginContext.state.loggedIn,
        libraryId, stage, story, storyId]);

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideVolume.handleRefresh",
            volume: volume,
        });
        setVolumeId(volume.id);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleStory = (newStory: Story): void => {
        logger.info({
            context: "GuideVolume.handleStory",
            story: newStory,
        });
        setStoryId(newStory.id);
    }

    const handleVolume = async (newVolume: Volume): Promise<void> => {
        logger.info({
            context: "GuideVolume.handleVolume",
            volume: newVolume,
        });
        setVolumeId(newVolume.id);  // Trigger (re)fetch of the specified Volume
    }

    const sortAuthors = (authors: Author[]): Author[] => {
        return authors.sort(function (a, b) {
            const aName = a.last_name + "|" + a.first_name;
            const bName = b.last_name + "|" + b.first_name;
            if (aName > bName) {
                return 1;
            } else if (aName < bName) {
                return -1;
            } else {
                return 0;
            }
        });
    }

    return (
        <Container fluid id="GuideVolume">

            <VolumeSummary
                volume={volume}
            />
            <hr color="cyan"/>

            {(stage === Stage.PARENT) ? (
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
                    handleStory={handleStory}
                    parent={volume}
                />
            ) : null}

            {(stage === Stage.WRITERS) ? (
                <StageWriters
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    story={story}
                />
            ) : null}

        </Container>
    )

}

export default GuideVolume;
