// useFetchStories -----------------------------------------------------------

// Custom hook to fetch Story objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import SeriesClient from "../clients/SeriesClient";
import VolumeClient from "../clients/VolumeClient";
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
    parent: Series | Volume;            // Parent object if no searchText specified
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
            let abridged: Library | Series | Volume | null = null;
            let newStories: Story[] = [];

            try {
                if ((props.library.id > 0) && (props.parent.id > 0)) {
                    if (props.searchText.length > 0) {
                        abridged = Abridgers.LIBRARY(props.library);
                        newStories = await LibraryClient.stories(props.library.id, {
                            limit: props.pageSize,
                            name: props.searchText,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Series) {
                        abridged = Abridgers.SERIES(props.parent);
                        newStories = await SeriesClient.stories(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        })
                    } else /* if (props.parent instanceof Volume) */ {
                        abridged = Abridgers.VOLUME(props.parent);
                        newStories = await VolumeClient.stories(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        })
                    }
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        library: Abridgers.LIBRARY(props.library),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        parent: abridged,
                        authors: Abridgers.STORIES(newStories),
                    });
                } else {
                    logger.info({
                        context: "useFetchStories.fetchStories",
                        msg: "Nothing to select",
                        library: Abridgers.LIBRARY(props.library),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        parent: abridged,
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchStories.fetchStories",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setLoading(false);
            setStories(newStories);

        }

        fetchStories();

    }, [props.currentPage, props.library, props.pageSize, props.parent, props.searchText]);

    return [{stories, error, loading}];

}

export default useFetchStories;
