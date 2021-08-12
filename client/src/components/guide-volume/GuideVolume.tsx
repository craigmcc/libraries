// GuideVolume ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Volume.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import StageVolume from "./StageVolume";
import VolumeSummary from "./VolumeSummary";
import { Stage } from "../guide-shared/Stage";
import StageAuthors from "../guide-shared/StageAuthors";
import StageStories from "../guide-shared/StageStories";
import StageWriters from "../guide-shared/StageWriters";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchStory from "../../hooks/useFetchStory";
import useFetchVolume from "../../hooks/useFetchVolume";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Component Details ---------------------------------------------------------

const GuideVolume = () => {

    const libraryContext = useContext(LibraryContext);

    const [stage, setStage] = useState<Stage>(Stage.PARENT);
    const [storyId, setStoryId] = useState<number>(-1);
    const [volumeId, setVolumeId] = useState<number>(-1);

    const [{story/*, error, loading*/}] = useFetchStory({ // TODO error/loading?
        library: libraryContext.state.library,
        storyId: storyId,
    });
    const [{volume/*, error, loading*/}] = useFetchVolume({ // TODO error/loading?
        library: libraryContext.state.library,
        volumeId: volumeId,
    });

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideVolume.handleRefresh",
            volume: Abridgers.VOLUME(volume),
        });
        setVolumeId(-1);
        setVolumeId(volume.id);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleStory = (newStory: Story): void => {
        logger.info({
            context: "GuideVolume.handleStory",
            story: Abridgers.STORY(newStory),
        });
        setStoryId(newStory.id);
        setStage(Stage.WRITERS);
    }

    const handleVolume = async (newVolume: Volume): Promise<void> => {
        logger.info({
            context: "GuideVolume.handleVolume",
            volume: Abridgers.VOLUME(newVolume),
        });
        setVolumeId(newVolume.id);
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
                    parent={volume}
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
