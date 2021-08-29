// GuideAuthor ---------------------------------------------------------------

// Guided management of overall Library information, starting from an Author.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import AuthorSummary from "./AuthorSummary";
import StageAuthor from "./StageAuthor";
import {HandleSeries, HandleStory, HandleVolume} from "../types";
import {Stage} from "../guide-shared/Stage";
import StageSerieses from "../guide-shared/StageSerieses";
import StageStories from "../guide-shared/StageStories";
import StageVolumes from "../guide-shared/StageVolumes";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchAuthor from "../../hooks/useFetchAuthor";
import Author from "../../models/Author";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Component Details ---------------------------------------------------------

const GuideAuthor = () => {

    const libraryContext = useContext(LibraryContext);

    const [stage, setStage] = useState<Stage>(Stage.PARENT);
    const [authorId, setAuthorId] = useState<number>(-1);

    const [{author/*, error, loading*/}] = useFetchAuthor({
        library: libraryContext.state.library,
        authorId: authorId,
    });

    const handleAuthor = async (theAuthor: Author): Promise<void> => {
        logger.info({
            context: "GuideAuthor.handleAuthor",
            author: Abridgers.AUTHOR(theAuthor),
        });
        setAuthorId(theAuthor.id);
    }

    const handleRefresh = (): void => {
        logger.info({
            context: "GuideAuthor.handleRefresh",
            author: Abridgers.AUTHOR(author),
        });
        setAuthorId(-1);
        setAuthorId(author.id);
    }

    const handleSeries: HandleSeries = (theSeries) => {
        logger.error({
            context: "GuideAuthor.handleSeries",
            msg: "Should never have been called",
            series: Abridgers.SERIES(theSeries),
        })
    }

    const handleStage = (theStage: Stage): void => {
        setStage(theStage);
    }

    const handleStory: HandleStory = (theStory) => {
        logger.error({
            context: "GuideAuthor.handleStory",
            msg: "Should never have been called",
            series: Abridgers.STORY(theStory),
        })
    }

    const handleVolume: HandleVolume = (theVolume) => {
        logger.error({
            context: "GuideAuthor.handleVolume",
            msg: "Should never have been called",
            volume: Abridgers.VOLUME(theVolume),
        });
    }

    return (
        <Container fluid id="GuideAuthor">

            <AuthorSummary
                author={author}
            />
            <hr color="cyan"/>

            {(stage === Stage.PARENT) ? (
                <StageAuthor
                    author={author}
                    handleAuthor={handleAuthor}
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                />
            ) : null}

            {(stage === Stage.SERIES) ? (
                <StageSerieses
                    handleRefresh={handleRefresh}
                    handleSeries={handleSeries}
                    handleStage={handleStage}
                    parent={author}
                />
            ) : null}

            {(stage === Stage.STORIES) ? (
                <StageStories
                    handleRefresh={handleRefresh}
                    handleStory={handleStory}
                    handleStage={handleStage}
                    parent={author}
                />
            ) : null}

            {(stage === Stage.VOLUMES) ? (
                <StageVolumes
                    handleRefresh={handleRefresh}
                    handleStage={handleStage}
                    handleVolume={handleVolume}
                    parent={author}
                />
            ) : null}

        </Container>
    )

}

export default GuideAuthor;
