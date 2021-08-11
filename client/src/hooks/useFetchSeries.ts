// useFetchSeries ------------------------------------------------------------

// Custom hook to fetch a specified Series object, fleshed out with nested
// Author and Story objects.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SeriesClient from "../clients/SeriesClient";
import StoryClient from "../clients/StoryClient";
import Library from "../models/Library";
import Series from "../models/Series";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import * as Sorters from "../util/sorters";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;               // Library for which to select data
    seriesId: number;               // Series ID to select (if not -1)
}

// Component Details ---------------------------------------------------------

const useFetchSeries = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [series, setSeries] = useState<Series>(new Series());

    useEffect(() => {

        const fetchSeries = async () => {

            setError(null);
            setLoading(true);

            try {
                if ((props.library.id > 0) && (props.seriesId > 0)) {

                    // Fetch the requested Series with nested authors and stories
                    const newSeries = await SeriesClient.find(props.library.id, props.seriesId, {
                        withAuthors: "",
                        withStories: "",
                    });

                    // Sort the nested authors and stories
                    newSeries.authors = Sorters.AUTHORS(newSeries.authors);
                    newSeries.stories = Sorters.STORIES(newSeries.stories);

                    // For each nested Story, load its associated Writers (i.e. Authors)
                    for (const story of newSeries.stories) {
                        story.authors = await StoryClient.authors(props.library.id, story.id);
                        // Server already sorted these authors appropriately
                    }

                    // Cause the fetched Series to be returned
                    logger.info({
                        context: "useFetchSeries.fetchSeries",
                        msg: "Return fetched Series with nested Author and Story objects",
                        library: Abridgers.LIBRARY(props.library),
                        seriesId: props.seriesId,
                        series: Abridgers.SERIES(newSeries),
                    });
                    setSeries(newSeries);

                } else {

                    const newSeries = new Series();
                    logger.info({
                        context: "useFetchSeries.fetchSeries",
                        msg: "Return empty Series because none selected",
                        library: Abridgers.LIBRARY(props.library),
                        seriesId: props.seriesId,
                        series: Abridgers.SERIES(newSeries),
                    });
                    setSeries(newSeries);

                }
            } catch (error) {
                logger.error({
                    context: "useFetchSeries.fetchSeries",
                    library: Abridgers.LIBRARY(props.library),
                    seriesId: props.seriesId,
                    error: error,
                });
                setError(error);
                setSeries(new Series());
            }

            setLoading(false);

        }

        fetchSeries();

    }, [props.library, props.seriesId]);

    return [{series, error, loading}];

}

export default useFetchSeries;
