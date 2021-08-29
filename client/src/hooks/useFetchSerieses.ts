// useFetchSerieses ----------------------------------------------------------

// Custom hook to fetch Series objects that correspond to input properties.
// (Yes, English pluralization rules are weird, but need to disambiguate.)

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import LibraryClient from "../clients/LibraryClient";
import StoryClient from "../clients/StoryClient";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    currentPage: number;                // One-relative current page number
    library: Library;                   // Library for which to select data
    pageSize: number;                   // Number of entries per returned page
    parent: Author | Library | Story;   // Parent object
    searchText: string;                 // Name match text (or "" for all)
}

// Component Details ---------------------------------------------------------

const useFetchSerieses = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [serieses, setSerieses] = useState<Series[]>([]);

    useEffect(() => {

        const fetchSerieses = async () => {

            setError(null);
            setLoading(true);
            let theSerieses: Series[] = [];

            try {
                if ((props.library.id > 0) && (props.parent.id > 0)) {
                    if (props.searchText.length > 0) {
                        theSerieses = await LibraryClient.series(props.library.id, {
                            limit: props.pageSize,
                            name: props.searchText,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        });
                    } else if (props.parent instanceof Author) {
                        theSerieses = await AuthorClient.series(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        });
                    } else if (props.parent instanceof Library) {
                        theSerieses = await LibraryClient.series(props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        });
                    } else if (props.parent instanceof Story) {
                        theSerieses = await StoryClient.series(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        });
                    }
                    logger.info({
                        context: "useFetchSerieses.fetchSerieses",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        serieses: Abridgers.SERIESES(theSerieses),
                    });
                } else {
                    logger.info({
                        context: "useFetchSerieses.fetchSerieses",
                        msg: "Nothing to select",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchSerieses.fetchSerieses",
                    library: Abridgers.LIBRARY(props.library),
                    parent: Abridgers.ANY(props.parent),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setLoading(false);
            setSerieses(theSerieses);

        }

        fetchSerieses();

    }, [props.currentPage, props.library, props.pageSize,
        props.parent, props.searchText]);

    return [{serieses, error, loading}];

}

export default useFetchSerieses;
