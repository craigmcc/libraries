// GuideAuthor ---------------------------------------------------------------

// Guided management of overall Library information, starting from an Author.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import AuthorSummary from "./AuthorSummary";
import StageAuthor from "./StageAuthor";
// import StageSeries from "./StageSeries";
// import StageStories from "./StageStories";
// import StageVolumes from "./StageVolumes";
import {Stage} from "../guide-shared/Stage";
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

    const handleStage = (newStage: Stage): void => {
        setStage(newStage);
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


        </Container>
    )

}

export default GuideAuthor;
