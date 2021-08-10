// useFetchVolumes -----------------------------------------------------------

// Custom hook to fetch Volumes that correspond to input properties.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import VolumeClient from "../clients/VolumeClient";
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

const useFetchVolume = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {

        const fetchVolumes = async () => {

            setError(null);
            setLoading(true);

            try {
                let newVolumes: Volume[] = [];
                const params = {
                    limit: props.pageSize,
                    offset: (props.pageSize * (props.currentPage - 1)),
                }
                if (props.library.id > 0) {
                    if (props.searchText.length > 0) {
                        newVolumes = await VolumeClient.all(props.library.id, {
                            ...params,
                            name: props.searchText,
                        });
                    } else {
                        newVolumes = await LibraryClient.volumes(props.library.id, params);
                    }
                }
                logger.debug({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    volumes: Abridgers.VOLUMES(newVolumes),
                });
                setVolumes(newVolumes);
            } catch (error) {
                logger.error({
                    context: "useFetchVolumes.fetchVolumes",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
                setVolumes([]);
            }

            setLoading(false);

        }

        fetchVolumes();

    }, [props.currentPage, props.library, props.pageSize, props.searchText]);

    return [{volumes, error, loading}];

}

export default useFetchVolume;
