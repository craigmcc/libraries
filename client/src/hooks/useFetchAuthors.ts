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
    parent: Series | Story | Volume;    // Parent object if no searchText specified
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
            let abridged: Library | Series | Story | Volume | null = null;
            let newAuthors: Author[] = [];

            try {
                if (props.library.id > 0) {
                    if (props.searchText.length > 0) {
                        abridged = Abridgers.LIBRARY(props.library);
                        newAuthors = await LibraryClient.authors(props.library.id, {
                            limit: props.pageSize,
                            name: props.searchText,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Series) {
                        abridged = Abridgers.SERIES(props.parent);
                        newAuthors = await SeriesClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Story) {
                        abridged = Abridgers.STORY(props.parent);
                        newAuthors = await StoryClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else /* if (props.parent instanceof Volume) */ {
                        abridged = Abridgers.VOLUME(props.parent);
                        newAuthors = await VolumeClient.authors(props.library.id, props.parent.id,{
                            limit: props.pageSize,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    }
                    logger.info({
                        context: "useFetchAuthors.fetchAuthors",
                        library: Abridgers.LIBRARY(props.library),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        parent: abridged,
                        authors: Abridgers.AUTHORS(newAuthors),
                    });
                }
            } catch (error) {
                logger.error({
                    context: "useFetchAuthors.fetchAuthors",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setAuthors(newAuthors);
            setLoading(false);

        }

        fetchAuthors();

    }, [props.currentPage, props.library, props.pageSize, props.parent, props.searchText]);

    return [{authors, error, loading}];

}

export default useFetchAuthors;
