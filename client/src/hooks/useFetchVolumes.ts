// useFetchVolumes -----------------------------------------------------------

// Custom hook to fetch Volume objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import LibraryClient from "../clients/LibraryClient";
import StoryClient from "../clients/StoryClient";
import Library from "../models/Library";
import Author from "../models/Author";
import Story from "../models/Story";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    currentPage: number;                // One-relative current page number
    library: Library;                   // Library for which to select data
    pageSize: number;                   // Number of entries per returned page
    parent: Author | Library | Story;   // Parent object of requested Volumes
    searchText: string;                 // Name match text (or "" for all)
}

// Component Details ---------------------------------------------------------

const useFetchVolumes = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {

        const fetchVolumes = async () => {

            setError(null);
            setLoading(true);
            let theVolumes: Volume[] = [];

            try {
                if (props.library.id > 0) {
                    if (props.parent instanceof Author) {
                        theVolumes = await AuthorClient.volumes(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            name: (props.searchText.length > 0) ? props.searchText : null,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        });
                    } else if (props.parent instanceof Story) {
                        theVolumes = await StoryClient.volumes(props.library.id, props.parent.id, {
                            limit: props.pageSize,
                            name: (props.searchText.length > 0) ? props.searchText : null,
                            offset: (props.pageSize * (props.currentPage - 1)),
                        })
                    } else /* if (props.parent instanceof Library) */ {
                        theVolumes = await LibraryClient.volumes(props.library.id, {
                            limit: props.pageSize,
                            name: (props.searchText.length > 0) ? props.searchText : null,
                            offset: (props.pageSize * (props.currentPage - 1)),
                            withAuthors: "",
                        });
                    }
                }
                logger.info({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    parent: Abridgers.ANY(props.parent),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    volumes: Abridgers.VOLUMES(theVolumes),
                });
            } catch (error) {
                logger.error({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    parent: Abridgers.ANY(props.parent),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setLoading(false);
            setVolumes(theVolumes);

        }

        fetchVolumes();

    }, [props.currentPage, props.library, props.pageSize, props.parent, props.searchText]);

    return [{volumes, error, loading}];

}

export default useFetchVolumes;
