// useFetchSerieses ----------------------------------------------------------

// Custom hook to fetch Series objects that correspond to input properties.
// (Yes, English pluralization rules are weird, but need to disambiguate.)

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import LibraryClient from "../clients/LibraryClient";
import Library from "../models/Library";
import Series from "../models/Series";
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

const useFetchSerieses = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [serieses, setSerieses] = useState<Series[]>([]);

    useEffect(() => {

        const fetchSerieses = async () => {

            setError(null);
            setLoading(true);

            try {
                let newSerieses: Series[] = [];
                if (props.library.id > 0) {
                    const params = {
                        limit: props.pageSize,
                        offset: (props.pageSize * (props.currentPage - 1)),
                    }
                    if (props.searchText.length > 0) {
                        newSerieses = await LibraryClient.series(props.library.id, {
                            ...params,
                            name: props.searchText,
                        });
                    } else {
                        newSerieses = await LibraryClient.series(props.library.id, params);
                    }
                    logger.info({
                        context: "useFetchSerieses.fetchSerieses",
                        library: Abridgers.LIBRARY(props.library),
                        currentPage: props.currentPage,
                        searchText: props.searchText,
                        serieses: Abridgers.SERIESES(newSerieses),
                    });
                    setSerieses(newSerieses);
                }
            } catch (error) {
                logger.error({
                    context: "useFetchSerieses.fetchSerieses",
                    library: Abridgers.LIBRARY(props.library),
                    currentPage: props.currentPage,
                    searchText: props.searchText,
                    error: error,
                });
                setError(error);
                setSerieses([]);
            }

            setLoading(false);

        }

        fetchSerieses();

    }, [props.currentPage, props.library, props.pageSize, props.searchText]);

    return [{serieses, error, loading}];

}

export default useFetchSerieses;
