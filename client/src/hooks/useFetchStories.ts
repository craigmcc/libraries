// useFetchStories -----------------------------------------------------------

// Custom hook to fetch Story objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import LibraryClient from "../clients/LibraryClient";
import SeriesClient from "../clients/SeriesClient";
import VolumeClient from "../clients/VolumeClient";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    currentPage: number;                // One-relative current page number
    library: Library;                   // Library for which to select data
    pageSize: number;                   // Number of entries per returned page
    parent: Author | Library | Series | Volume; // Parent object
    searchText: string;                 // Name match text (or "" for all)
}

// Component Details ---------------------------------------------------------

const useFetchStories = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {

        const fetchStories = async () => {

            setError(null);
            setLoading(true);
            let theStories: Story[] = [];

            try {
                if ((props.library.id > 0) && (props.parent.id > 0)) {
                    if (props.searchText.length > 0) {
                        theStories = await LibraryClient.stories(props.library.id, {
                            limit: props.pageSize,
                            name: props.searchText,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Author) {
                        theStories = await AuthorClient.stories(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Series) {
                        theStories = await SeriesClient.stories(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Volume) {
                        theStories = await VolumeClient.stories(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else /* if (props.parent instanceof Library) */ {
                        theStories = await LibraryClient.stories(props.library.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    }
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        stories: Abridgers.STORIES(theStories),
                    });
                } else {
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        msg: "Nothing to select",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchStories.fetchStories",
                    library: Abridgers.LIBRARY(props.library),
                    parent: Abridgers.ANY(props.parent),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setLoading(false);
            setStories(theStories);

        }

        fetchStories();

    }, [props.currentPage, props.library, props.pageSize,
        props.parent, props.searchText]);

    return [{stories, error, loading}];

}

export default useFetchStories;
