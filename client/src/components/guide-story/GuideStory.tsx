// GuideStory ----------------------------------------------------------------

// Guided management of overall Library information, starting from a Story.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import StageStory from "./StageStory";
import StorySummary from "./StorySummary";
import {HandleSeries, HandleVolume} from "../types";
import {Stage} from "../guide-shared/Stage";
import StageAuthors from "../guide-shared/StageAuthors";
import StageSerieses from "../guide-shared/StageSerieses";
import StageVolumes from "../guide-shared/StageVolumes";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchStory from "../../hooks/useFetchStory"
import Story from "../../models/Story";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Component Details ---------------------------------------------------------

const GuideStory = () => {

    const libraryContext = useContext(LibraryContext);

    const [stage, setStage] = useState<Stage>(Stage.PARENT);
    const [storyId, setStoryId] = useState<number>(-1);

    const [{story/*, error, loading*/}] = useFetchStory({
        library: libraryContext.state.library,
        storyId: storyId,
    });

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideStory.handleRefresh",
            story: Abridgers.STORY(story),
        });
        setStoryId(-1);
        setStoryId(story.id);
    }

    const handleSeries: HandleSeries = (theSeries): void => {
        logger.error({
            context: "GuideStory.handleSeries",
            series: Abridgers.SERIES(theSeries),
        });
    }

    const handleStage = (theStage: Stage): void => {
        setStage(theStage);
    }

    const handleStory = async (theStory: Story): Promise<void> => {
        logger.info({
            context: "GuideStory.handleStory",
            story: Abridgers.STORY(theStory),
        });
        setStoryId(theStory.id);
    }

    const handleVolume: HandleVolume = (theVolume) => {
        logger.error({
            context: "GuideStory.handleVolume",
            msg: "Should never have been called",
            volume: Abridgers.VOLUME(theVolume),
        });
    }

    return (
        <Container fluid id="GuideStory">

            <StorySummary
                story={story}
            />
            <hr color="cyan"/>

            {(stage === Stage.PARENT) ? (
                <StageStory
                    story={story}
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleStory={handleStory}
                />
            ) : null}

            {(stage === Stage.AUTHORS) ? (
                <StageAuthors
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    parent={story}
                />
            ) : null}

            {(stage === Stage.SERIES) ? (
                <StageSerieses
                    handleRefresh={handleRefresh}
                    handleSeries={handleSeries}
                    handleStage={handleStage}
                    parent={story}
                />
            ) : null}

            {(stage === Stage.VOLUMES) ? (
                <StageVolumes
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleVolume={handleVolume}
                    parent={story}
                />
            ) : null}

        </Container>
    )

}

export default GuideStory;
