// useFetchAuthor ------------------------------------------------------------

// Custom hook to fetch a specified Author object, fleshed out with nested
// Series, Story, and Volume objects.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import Author from "../models/Author";
import Library from "../models/Library";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import * as Sorters from "../util/sorters";

// Incoming Properties -------------------------------------------------------

export interface Props {
    authorId: number;                   // Author ID to select (if not -1)
    library: Library;                   // Library for which to select data
}

// Component Details ---------------------------------------------------------

const useFetchAuthor = (props: Props) => {

    const [author, setAuthor] = useState<Author>(new Author());
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchAuthor = async () => {

            setError(null);
            setLoading(true);

            try {
                if ((props.library.id > 0) && (props.authorId > 0)) {

                    // Fetch the requested Author with nested objects
                    const theAuthor = await AuthorClient.find(props.library.id, props.authorId, {
                        withSeries: "",
                        withStories: "",
                        withVolumes: "",
                    });

                    // Sort the nested objects
                    theAuthor.series = Sorters.SERIES(theAuthor.series);
                    theAuthor.stories = Sorters.STORIES(theAuthor.stories);
                    theAuthor.volumes = Sorters.VOLUMES(theAuthor.volumes);

                    // Cause the fetched Author to be returned
                    logger.info({
                        context: "useFetchAuthor.fetchAuthor",
                        msg: "Returned fetched Author with nested objects",
                        library: Abridgers.LIBRARY(props.library),
                        authorId: props.authorId,
                        author: Abridgers.AUTHOR(theAuthor),
                    });
                    setAuthor(theAuthor);

                } else {

                    const theAuthor = new Author();
                    logger.info({
                        context: "useFetchAuthor.fetchAuthor",
                        msg: "Return empty Author because none selected",
                        library: Abridgers.LIBRARY(props.library),
                        authorId: props.authorId,
                        author: Abridgers.AUTHOR(theAuthor),
                    });
                    setAuthor(theAuthor);

                }

            } catch (error) {
                logger.error({
                    context: "useFetchAuthor.fetchAuthor",
                    library: Abridgers.LIBRARY(props.library),
                    authorId: props.authorId,
                    error: error,
                })
                setError(error);
                setAuthor(new Author());
            }

            setLoading(false);

        }

        fetchAuthor();

    }, [props.library, props.authorId]);

    return [{author, error, loading}];

}

export default useFetchAuthor;
