// GuideSeries ---------------------------------------------------------------

// Guided management of overall Library information, starting from a Series.

// External Modules ----------------------------------------------------------

import {useContext, useEffect, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import SeriesSummary from "./SeriesSummary";
import SeriesClient from "../../clients/SeriesClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import StoryClient from "../../clients/StoryClient";
import StageAuthors from "./StageAuthors";
import StageSeries from "./StageSeries";

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
    const [refresh, setRefresh] = useState<boolean>(false);
    const [series, setSeries] = useState<Series>(new Series());
    const [seriesId, setSeriesId] = useState<number>(-1);
    const [stage, setStage] = useState<Stage>(Stage.SERIES);
    const [story, setStory] = useState<Story>(new Story());
    const [storyId, setStoryId] = useState<number>(-1);

    useEffect(() => {

        const fetchSeries = async () => {

            logger.info({
                context: "GuideSeries.fetchSeries",
                msg: "Input conditions",
                libraryId: libraryId,
                refresh: refresh,
                seriesId: seriesId,
                series: series,
            });

            if (loginContext.state.loggedIn) {
                if ((libraryId > 0) && (seriesId > 0)) {
                    if ((seriesId !== series.id) || refresh) {
                        try {
                            const newSeries = await SeriesClient.find(libraryId, seriesId, {
                                withAuthors: "",
                                withStories: "",
                            });
                            logger.info({
                                context: "GuideSeries.fetchSeries",
                                msg: "Fetch updated Series",
                                series: newSeries,
                            });
                            setSeries(newSeries);
                            if (stage === Stage.SERIES) {
                                setStage(Stage.AUTHORS); // Implicitly advance after Series selected
                            }
                        } catch (error) {
                            ReportError("GuideSeries.fetchSeries", error);
                        }
                    } else {
                        logger.info({
                            context: "GuideSeries.fetchSeries",
                            msg: "Logged in, same Series or not refresh - skip"
                        });
                    }
                } else {
                    logger.info({
                        context: "GuideSeries.fetchSeries",
                        msg: "Logged in, not refresh, missing libraryId/seriesId - skip",
                    });
                }
            } else {
                logger.info({
                    context: "GuideSeries.fetchSeries",
                    msg: "Not logged in, revert",
                });
                if (series.id > 0) {
                    setSeries(new Series());
                }
                if (seriesId > 0) {
                    setSeriesId(-1);
                }
            }

            if (refresh) {
                setRefresh(false);
            }

        }

        fetchSeries();

    }, [libraryContext, loginContext,
        libraryId, refresh, series, seriesId, stage]);

    useEffect(() => {

        const fetchStory = async () => {

            logger.info({
                context: "GuideSeries.fetchStory",
                msg: "Input conditions",
                libraryId: libraryId,
                refresh: refresh,
                storyId: storyId,
                story: story,
            });

            if (loginContext.state.loggedIn) {
                if ((libraryId > 0) && (storyId > 0)) {
                    if ((storyId !== story.id) || refresh) {
                        try {
                            const newStory = await StoryClient.find(libraryId, storyId, {
                                withAuthors: "",
                            });
                            logger.info({
                                context: "GuideSeries.fetchStory",
                                msg: "Fetch updated Story",
                                story: newStory,
                            });
                            setStory(newStory);
                            if (stage === Stage.STORIES) {
                                setStage(Stage.WRITERS); // Implicitly advance after Story selected
                            }
                        } catch (error) {
                            ReportError("GuideSeries.fetchStory", error);
                        }
                    } else {
                        logger.info({
                            context: "GuideSeries.fetchStory",
                            msg: "Logged in, same Story or not refresh - skip"
                        });
                    }
                } else {
                    logger.info({
                        context: "GuideSeries.fetchStory",
                        msg: "Logged in, not refresh, missing libraryId/storyId - skip",
                    });
                }
            } else {
                logger.info({
                    context: "GuideSeries.fetchStory",
                    msg: "Not logged in, revert",
                });
                if (story.id > 0) {
                    setStory(new Story());
                }
                if (storyId > 0) {
                    setStoryId(-1);
                }
            }

            if (refresh) {
                setRefresh(false);
            }

        }

        fetchStory();

    }, [libraryContext, loginContext,
        libraryId, refresh, stage, story, storyId]);

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideSeries.handleRefresh",
            seriesId: series.id,
            series: series,
        });
        setRefresh(true);
    }

    const handleSeries = async (newSeries: Series): Promise<void> => {
        logger.info({
            context: "GuideSeries.handleSeries",
            series: newSeries,
        });
        setSeriesId(newSeries.id); // Trigger (re)fetch of the specified Series
    }

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
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

        </Container>
    )

}

export default GuideSeries;
