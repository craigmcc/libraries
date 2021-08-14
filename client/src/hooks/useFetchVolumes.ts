// useFetchVolumes -----------------------------------------------------------

// Custom hook to fetch Volume objects that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import Library from "../models/Library";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    currentPage: number;                // One-relative current page number
    library: Library;                   // Library for which to select data
    pageSize: number;                   // Number of entries per returned page
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
            let newVolumes: Volume[] = [];

            try {
                if (props.library.id > 0) {
                    newVolumes = await LibraryClient.volumes(props.library.id, {
                        limit: props.pageSize,
                        name: (props.searchText.length > 0) ? props.searchText : null,
                        offset: (props.pageSize * (props.currentPage - 1)),
                        withAuthors: "",
                    });
                }
                logger.info({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    volumes: Abridgers.VOLUMES(newVolumes),
                });
            } catch (error) {
                logger.error({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
            }

            setLoading(false);
            setVolumes(newVolumes);

        }

        fetchVolumes();

    }, [props.currentPage, props.library, props.pageSize, props.searchText]);

    return [{volumes, error, loading}];

}

export default useFetchVolumes;
