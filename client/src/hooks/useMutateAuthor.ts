// useMutateAuthor -----------------------------------------------------------

// Custom hook to encapsulate operations that insert/remove/update an Author.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    author: Author | null;              // Currently selected Author (if any)
    library: Library;                   // Library for which to process data
    parent: Library | Series | Story | Volume;    // Currently selected Series/Story/Volume
}

// Component Details ---------------------------------------------------------

const useMutateAuthor = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateAuthor.useEffect",
            library: Abridgers.LIBRARY(props.library),
            parent: abridged(props.parent),
        });
    }, [props.author, props.library, props.parent]);

    const abridged = (parent: Library | Series | Story | Volume): Library | Series | Story | Volume => {
        if (parent instanceof Library) {
            return Abridgers.LIBRARY(parent);
        } if (parent instanceof Series) {
            return Abridgers.SERIES(parent);
        } else if (parent instanceof Story) {
            return Abridgers.STORY(parent);
        } else /* if (parent instanceof Volume) */ {
            return Abridgers.VOLUME(parent);
        }
    }

    const performExclude = async (theAuthor: Author): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Library) {
                // No semantic meaning
            } else if (props.parent instanceof Series) {
                await AuthorClient.seriesExclude(props.library.id, theAuthor.id, props.parent.id);
                logger.info({
                    context: "useMutateAuthor.performExclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    series: Abridgers.SERIES(props.parent),
                });
            } else if (props.parent instanceof Story) {
                await AuthorClient.storiesExclude(props.library.id, theAuthor.id, props.parent.id);
                logger.info({
                    context: "useMutateAuthor.performExclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    story: Abridgers.STORY(props.parent),
                });
            } else /* if (props.parent instanceof Volume) */ {
                await AuthorClient.volumesExclude(props.library.id, theAuthor.id, props.parent.id);
                logger.info({
                    context: "useMutateAuthor.performExclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    volume: Abridgers.VOLUME(props.parent),
                });
            }
        } catch (error) {
            logger.error({
                context: "useMutateAuthor.performExclude",
                library: Abridgers.LIBRARY(props.library),
                author: Abridgers.AUTHOR(theAuthor),
                parent: abridged(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

    const performInclude = async (theAuthor: Author): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            theAuthor.principal = true; // Assume by default
            if (props.parent instanceof Library) {
                // No semantic meaning
            } else if (props.parent instanceof Series) {
                await AuthorClient.seriesInclude(props.library.id, theAuthor.id, props.parent.id, theAuthor.principal);
                logger.info({
                    context: "useMutateAuthor.performInclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    series: Abridgers.SERIES(props.parent),
                });
            } else if (props.parent instanceof Story) {
                await AuthorClient.storiesInclude(props.library.id, theAuthor.id, props.parent.id, theAuthor.principal);
                logger.info({
                    context: "useMutateAuthor.performInclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    story: Abridgers.STORY(props.parent),
                });
            } else /* if (props.parent instanceof Volume) */ {
                await AuthorClient.volumesInclude(props.library.id, theAuthor.id, props.parent.id, theAuthor.principal);
                logger.info({
                    context: "useMutateAuthor.performInclude",
                    author: Abridgers.AUTHOR(theAuthor),
                    volume: Abridgers.VOLUME(props.parent),
                });
            }
        } catch (error) {
            logger.error({
                context: "useMutateAuthor.performInclude",
                library: Abridgers.LIBRARY(props.library),
                author: Abridgers.AUTHOR(theAuthor),
                parent: abridged(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

    const performInsert = async (theAuthor: Author): Promise<Author> => {

        setError(null);
        setProcessing(true);
        let inserted = new Author({library_id: props.library.id});

        try {

            // Persist the requested Author
            inserted = await AuthorClient.insert(props.library.id, theAuthor);
            logger.info({
                context: "useMutateAuthor.performInsert",
                author: Abridgers.AUTHOR(inserted),
            });

        } catch (error) {
            logger.error({
                context: "useMutateAuthor.performInsert",
                library: Abridgers.LIBRARY(props.library),
                author: Abridgers.AUTHOR(inserted),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return inserted;

    }

    const performRemove = async (theAuthor: Author): Promise<Author> => {

        setError(null);
        setProcessing(true);
        let removed = new Author({library_id: props.library.id});

        try {
            removed = await AuthorClient.remove(props.library.id, theAuthor.id);
            logger.info({
                context: "useMutateAuthor.performRemove",
                author: Abridgers.AUTHOR(removed),
            });
        } catch (error) {
            logger.error({
                context: "useMutateAuthor.performRemove",
                author: Abridgers.AUTHOR(theAuthor),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return removed;

    }

    const performUpdate = async (theAuthor: Author): Promise<Author> => {

        setError(null);
        setProcessing(true);
        let updated = new Author({library_id: props.library.id});

        try {

            // Persist the updated Author
            updated = await AuthorClient.update(props.library.id, theAuthor.id, theAuthor);
            logger.info({
                context: "useMutateAuthor.performUpdate",
                author: Abridgers.AUTHOR(updated),
            });

            // If the principal changed, remove and insert to update it
            if (props.author && (theAuthor.principal !== props.author.principal)) {
                logger.info({
                    context: "useMutateAuthor.performUpdate",
                    msg: "Reregister Author-Series/Author-Volume for new principal",
                    author: Abridgers.AUTHOR(updated),
                });
                try {
                    if (props.parent instanceof Series) {
                        await AuthorClient.seriesExclude(props.library.id, theAuthor.id, props.parent.id);
                        await AuthorClient.seriesInclude(props.library.id, theAuthor.id, props.parent.id, theAuthor.principal);
                    } else if (props.parent instanceof Volume) {
                        await AuthorClient.volumesExclude(props.library.id, theAuthor.id, props.parent.id);
                        await AuthorClient.volumesInclude(props.library.id, theAuthor.id, props.parent.id, theAuthor.principal);
                    }
                } catch (error) {
                    // Ignore error
                }
            }

        } catch (error) {
            logger.error({
                context: "useMutateAuthor.performUpdate",
                author: Abridgers.AUTHOR(theAuthor),
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

export default useMutateAuthor;
