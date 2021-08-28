// useMutateSeries -----------------------------------------------------------

// Custom hook to encapsulate operations that insert/remove/update a Series.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import SeriesClient from "../clients/SeriesClient";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;                   // Library for which to process data
    parent: Author | Library | Story;   // Currently selected Author/Story
}

// Component Details ---------------------------------------------------------

const useMutateSeries = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateSeries.useEffect",
            library: Abridgers.LIBRARY(props.library),
            parent: Abridgers.ANY(props.parent),
        });
    }, [props.library, props.parent]);

    const performExclude = async (theSeries: Series): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.seriesExclude(props.library.id, props.parent.id, theSeries.id);
                logger.info({
                    context: "useMutateSeries.performExclude",
                    series: Abridgers.SERIES(theSeries),
                    author: Abridgers.AUTHOR(props.parent),
                });
            } else if (props.parent instanceof Story) {
                await SeriesClient.storiesExclude(props.library.id, theSeries.id, props.parent.id);
                logger.info({
                    context: "useMutateSeries.performExclude",
                    series: Abridgers.SERIES(theSeries),
                    story: Abridgers.STORY(props.parent),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateSeries.performExclude",
                library: Abridgers.LIBRARY(props.library),
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

    const performInclude = async (theSeries: Series): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.seriesInclude(props.library.id, props.parent.id, theSeries.id, props.parent.principal);
                logger.info({
                    context: "useMutateSeries.performInclude",
                    series: Abridgers.SERIES(theSeries),
                    author: Abridgers.AUTHOR(props.parent),
                });
            } else if (props.parent instanceof Story) {
                await SeriesClient.storiesInclude(props.library.id, theSeries.id, props.parent.id, props.parent.ordinal);
                logger.info({
                    context: "useMutateSeries.performInclude",
                    series: Abridgers.SERIES(theSeries),
                    story: Abridgers.STORY(props.parent),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateSeries.performInclude",
                library: Abridgers.LIBRARY(props.library),
                series: Abridgers.SERIES(theSeries),
                parent: Abridgers.ANY(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

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

    return [{performExclude, performInclude, performInsert, performRemove,
        performUpdate, error, processing}];

}

export default useMutateSeries;
