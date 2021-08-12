// useMutateSeries -----------------------------------------------------------

// Custom hook to encapsulate operations that insert/remove/update a Series.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import SeriesClient from "../clients/SeriesClient";
import Library from "../models/Library";
import Series from "../models/Series";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;                   // Library for which to process data
}

// Component Details ---------------------------------------------------------

const useMutateSeries = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateSeries.useEffect",
            library: Abridgers.LIBRARY(props.library),
        });
    }, [props.library]);

    const performInsert = async (theSeries: Series): Promise<Series> => {

        setError(null);
        setProcessing(true);
        let inserted = new Series({library_id: props.library.id});

        try {

            // Persist the requested Series
            inserted = await SeriesClient.insert(props.library.id, theSeries);
            logger.info({
                context: "useMutateSeries.performInsert",
                series: Abridgers.SERIES(inserted),
            });

        } catch (error) {
            logger.error({
                context: "useMutateSeries.performInsert",
                library: Abridgers.LIBRARY(props.library),
                series: Abridgers.SERIES(inserted),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return inserted;

    }

    const performRemove = async (theSeries: Series): Promise<Series> => {

        setError(null);
        setProcessing(true);
        let removed = new Series({library_id: props.library.id});

        try {
            removed = await SeriesClient.remove(props.library.id, theSeries.id);
            logger.info({
                context: "useMutateSeries.performRemove",
                series: Abridgers.SERIES(removed),
            });
        } catch (error) {
            logger.error({
                context: "useMutateSeries.performRemove",
                series: Abridgers.SERIES(theSeries),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return removed;

    }

    const performUpdate = async (theSeries: Series): Promise<Series> => {

        setError(null);
        setProcessing(true);
        let updated = new Series({library_id: props.library.id});

        try {
            updated = await SeriesClient.update(props.library.id, theSeries.id, theSeries);
            logger.info({
                context: "useMutateSeries.performUpdate",
                series: Abridgers.SERIES(updated),
            });
        } catch (error) {
            logger.error({
                context: "useMutateSeries.performUpdate",
                series: Abridgers.SERIES(theSeries),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return updated;

    }

    return [{performInsert, performRemove, performUpdate, error, processing}];

}

export default useMutateSeries;
