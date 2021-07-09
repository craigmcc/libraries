// GuideSeries ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Series.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import SeriesSummary from "./SeriesSummary";
import StageAuthors from "./StageAuthors";
import StageSeries from "./StageSeries";
import StageStories from "./StageStories";
import StageWriters from "./StageWriters";
import SeriesClient from "../../clients/SeriesClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import StoryClient from "../../clients/StoryClient";

// Component Details ---------------------------------------------------------

export enum Stage {
    SERIES,
    AUTHORS,
    STORIES,
    WRITERS,
}

export type HandleStage = (newStage: Stage) => void;

const GuideSeries = () => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [series, setSeries] = useState<Series>(new Series());
    const [seriesId, setSeriesId] = useState<number>(-1);
    const [stage, setStage] = useState<Stage>(Stage.SERIES);
    const [story, setStory] = useState<Story>(new Story());
    const [storyId, setStoryId] = useState<number>(-1);

    useEffect(() => {

        const fetchSeries = async () => {

            logger.debug({
                context: "GuideSeries.fetchSeries",
                msg: "Input conditions",
                libraryId: libraryId,
                seriesId: seriesId,
                series: series,
            });

            if (loginContext.state.loggedIn) {
                if (libraryId > 0) {
                    if (seriesId > 0) {
                        logger.debug({
                            context: "GuideSeries.fetchSeries",
                            msg: "Fetch requested Series",
                            seriesId: seriesId,
                        });
                        try {
                            const newSeries = await SeriesClient.find(libraryId, seriesId, {
                                withAuthors: "",
                                withStories: "",
                            });
                            newSeries.authors = sortAuthors(newSeries.authors);
                            newSeries.stories = newSeries.stories.sort(function (a, b) {
                                if (a.ordinal === null) {
                                    return (b.ordinal === null ? 0 : -1);
                                } else if (b.ordinal === null) {
                                    return 1;
                                } else {
                                    return a.ordinal - b.ordinal;
                                }
                            });
                            for (const story of newSeries.stories) {
                                story.authors = await StoryClient.authors(libraryId, story.id);
                            }
                            logger.info({
                                context: "GuideSeries.fetchSeries",
                                msg: "Fleshed out Series",
                                series: newSeries,
                            });
                            setSeries(newSeries);
                            setSeriesId(-1);
                        } catch (error) {
                            ReportError("GuideSeries.fetchSeries", error);
                            setSeries(new Series());
                            setSeriesId(-1);
                        }
                    } else {
                        logger.debug({
                            context: "GuideSeries.fetchSeries",
                            msg: "No new seriesId - keep existing",
                        });
                    }
                } else {
                    logger.debug({
                        context: "GuideSeries.fetchSeries",
                        msg: "No libraryId - reset",
                    });
                    if (series.id > 0) {
                        setSeries(new Series());
                    }
                    if (seriesId > 0) {
                        setSeriesId(-1);
                    }
                }
            } else {
                logger.debug({
                    context: "GuideSeries.fetchSeries",
                    msg: "Not logged in - reset",
                });
                if (series.id > 0) {
                    setSeries(new Series());
                }
                if (seriesId > 0) {
                    setSeriesId(-1);
                }
            }

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

        fetchSeries();

    }, [loginContext.state.loggedIn,
        libraryId, series, seriesId, stage]);

    useEffect(() => {

        const fetchStory = async () => {

            logger.debug({
                context: "GuideSeries.fetchStory",
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
                            logger.info({
                                context: "GuideSeries.fetchStory",
                                msg: "Fleshed out Story",
                                story: newStory,
                            });
                            setStory(newStory);
                            if (stage === Stage.STORIES) {
                                setStage(Stage.WRITERS); // Implicitly advance after Story selected
                            }
                            setStoryId(-1);
                        } catch (error) {
                            ReportError("GuideSeries.fetchStory", error);
                            setStory(new Story());
                            setStoryId(-1);
                        }
                    } else {
                        logger.debug({
                            context: "GuideSeries.fetchStory",
                            msg: "No new storyId - keep existing",
                        });
                    }
                } else {
                    logger.debug({
                        context: "GuideSeries.fetchStory",
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
                    context: "GuideSeries.fetchStory",
                    msg: "Not logged in - reset"
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

    }, [loginContext.state.loggedIn,
        libraryId, stage, story, storyId]);

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideSeries.handleRefresh",
            series: series,
        });
        setSeriesId(series.id);
    }

    const handleSeries = async (newSeries: Series): Promise<void> => {
        logger.info({
            context: "GuideSeries.handleSeries",
            series: newSeries,
        });
        setSeriesId(newSeries.id); // Trigger (re)fetch of the specified Series
    }

    const handleStage = (newStage: Stage): void => {
        logger.debug({
            context: "GuideSeries.handleStage",
            stage: newStage,
        });
        setStage(newStage);
    }

    const handleStory = (newStory: Story): void => {
        logger.info({
            context: "GuideSeries.handleStory",
            story: newStory,
        });
        setStoryId(newStory.id);
    }

    return (
        <Container fluid id="GuideSeries">

            <SeriesSummary
                series={series}
            />
            <hr color="cyan"/>

            {(stage === Stage.SERIES) ? (
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
                    series={series}
                />
            ) : null}

            {(stage === Stage.STORIES) ? (
                <StageStories
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleStory={handleStory}
                    series={series}
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