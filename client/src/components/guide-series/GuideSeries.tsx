// GuideSeries ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Series.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import SeriesSummary from "./SeriesSummary";
import StageSeries from "./StageSeries";
import { Stage } from "../guide-shared/Stage";
import StageAuthors from "../guide-shared/StageAuthors";
import StageStories from "../guide-shared/StageStories";
import StageWriters from "../guide-shared/StageWriters";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchSeries from "../../hooks/useFetchSeries";
import useFetchStory from "../../hooks/useFetchStory";
import Series from "../../models/Series";
import Story from "../../models/Story";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Component Details ---------------------------------------------------------

const GuideSeries = () => {

    const libraryContext = useContext(LibraryContext);

    const [seriesId, setSeriesId] = useState<number>(-1);
    const [stage, setStage] = useState<Stage>(Stage.PARENT);
    const [storyId, setStoryId] = useState<number>(-1);

    const [{series/*, error, loading*/}] = useFetchSeries({ // TODO error/loading?
        library: libraryContext.state.library,
        seriesId: seriesId,
    });
    const [{story/*, error, loading*/}] = useFetchStory({ // TODO error/loading?
        library: libraryContext.state.library,
        storyId: storyId,
    });

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideSeries.handleRefresh (NOOP)",
            series: Abridgers.SERIES(series),
        });
//        setSeriesId(series.id);
    }

    const handleSeries = async (newSeries: Series): Promise<void> => {
        logger.info({
            context: "GuideSeries.handleSeries",
            series: Abridgers.SERIES(newSeries),
        });
        setSeriesId(newSeries.id);
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
    }

    const handleStory = (newStory: Story): void => {
        logger.info({
            context: "GuideSeries.handleStory",
            story: Abridgers.STORY(newStory),
        });
        setStoryId(newStory.id);
        setStage(Stage.WRITERS);
    }

    return (
        <Container fluid id="GuideSeries">

            <SeriesSummary
                series={series}
            />
            <hr color="cyan"/>

            {(stage === Stage.PARENT) ? (
                <StageSeries
                    handleRefresh={handleRefresh}
                    handleSeries={handleSeries}
                    handleStage={handleStage}
                    series={series}
                />
            ): null}

            {(stage === Stage.AUTHORS) ? (
                <StageAuthors
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    parent={series}
                />
            ) : null}

            {(stage === Stage.STORIES) ? (
                <StageStories
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleStory={handleStory}
                    parent={series}
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

export default GuideSeries;
