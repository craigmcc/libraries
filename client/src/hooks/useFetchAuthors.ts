// useFetchAuthors -----------------------------------------------------------

// Custom hook to fetch Author objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import SeriesClient from "../clients/SeriesClient";
import StoryClient from "../clients/StoryClient";
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
    parent: Library | Series | Story | Volume;    // Parent object
    searchText: string;                 // Name match text (or "" for all)
}

// Component Details ---------------------------------------------------------

const useFetchAuthors = (props: Props) => {

    const [authors, setAuthors] = useState<Author[]>([]);
    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {

        const fetchAuthors = async () => {

            setError(null);
            setLoading(true);
            let theAuthors: Author[] = [];

            try {
                if ((props.library.id > 0) && (props.parent.id > 0)) {
                    if (props.searchText.length > 0) {
                        theAuthors = await LibraryClient.authors(props.library.id, {
                            limit: props.pageSize,
                            name: props.searchText,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Library) {
                        theAuthors = await LibraryClient.authors(props.parent.id, {
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Series) {
                        theAuthors = await SeriesClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Story) {
                        theAuthors = await StoryClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Volume) {
                        theAuthors = await VolumeClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    }
                    logger.info({
                        context: "useFetchAuthors.fetchAuthors",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        authors: Abridgers.AUTHORS(theAuthors),
                    });
                } else {
                    logger.info({
                        context: "useFetchAuthors.fetchAuthors",
                        msg: "Nothing to select",
                        library: Abridgers.LIBRARY(props.library),
                        parent: Abridgers.ANY(props.parent),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchAuthors.fetchAuthors",
                    library: Abridgers.LIBRARY(props.library),
                    parent: Abridgers.ANY(props.parent),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setAuthors(theAuthors);
            setLoading(false);

        }

        fetchAuthors();

    }, [props.currentPage, props.library, props.pageSize,
        props.parent, props.searchText]);

    return [{authors, error, loading}];

}

export default useFetchAuthors;
