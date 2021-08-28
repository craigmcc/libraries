// useMutateStory -----------------------------------------------------------

// Custom hook to encapsulate operations that insert/remove/update an Story.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import SeriesClient from "../clients/SeriesClient";
import StoryClient from "../clients/StoryClient";
import VolumeClient from "../clients/VolumeClient";
import Author from "../models/Author";
import Story from "../models/Story";
import Library from "../models/Library";
import Series from "../models/Series";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;                   // Library for which to process data
    parent: Author | Library | Series | Volume;    // Currently selected Author/Series/Volume
    story: Story | null;                // Currently selected Story (if any)
}

// Component Details ---------------------------------------------------------

const useMutateStory = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateStory.useEffect",
            library: Abridgers.LIBRARY(props.library),
            parent: Abridgers.ANY(props.parent),
            story: (props.story) ? Abridgers.STORY(props.story) : null,
        });
    }, [props.library, props.parent, props.story]);

    const performExclude = async (theStory: Story): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.storiesExclude(props.library.id, props.parent.id, theStory.id);
                logger.info({
                    context: "useMutateStory.performExclude",
                    story: Abridgers.STORY(theStory),
                    author: Abridgers.AUTHOR(props.parent),
                });
            } else if (props.parent instanceof Series) {
                await SeriesClient.storiesExclude(props.library.id, props.parent.id, theStory.id);
                logger.info({
                    context: "useMutateStory.performExclude",
                    story: Abridgers.STORY(theStory),
                    series: Abridgers.SERIES(props.parent),
                });
            } else if (props.parent instanceof Volume) {
                await VolumeClient.storiesExclude(props.library.id, props.parent.id, theStory.id);
                logger.info({
                    context: "useMutateStory.performExclude",
                    story: Abridgers.STORY(theStory),
                    volume: Abridgers.VOLUME(props.parent),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateStory.performExclude",
                library: Abridgers.LIBRARY(props.library),
                story: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

    const performInclude = async (theStory: Story): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.storiesInclude(props.library.id, props.parent.id, theStory.id, props.parent.principal);
                logger.info({
                    context: "useMutateStory.performInclude",
                    story: Abridgers.STORY(theStory),
                    author: Abridgers.AUTHOR(props.parent),
                });
            }
            if (props.parent instanceof Series) {
                await SeriesClient.storiesInclude(props.library.id, props.parent.id, theStory.id, theStory.ordinal);
                logger.info({
                    context: "useMutateStory.performInclude",
                    story: Abridgers.STORY(theStory),
                    series: Abridgers.SERIES(props.parent),
                });
            } else if (props.parent instanceof Volume) {
                await VolumeClient.storiesInclude(props.library.id, props.parent.id, theStory.id);
                logger.info({
                    context: "useMutateStory.performInclude",
                    story: Abridgers.STORY(theStory),
                    volume: Abridgers.VOLUME(props.parent),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateStory.performInclude",
                library: Abridgers.LIBRARY(props.library),
                story: Abridgers.STORY(theStory),
                parent: Abridgers.ANY(props.parent),
            });
            setError(error);
        }
        setProcessing(false);
    }

    const performInsert = async (theStory: Story): Promise<Story> => {

        setError(null);
        setProcessing(true);
        let inserted = new Story({library_id: props.library.id});

        try {

            // Persist the requested Story
            inserted = await StoryClient.insert(props.library.id, theStory);
            logger.info({
                context: "useMutateStory.performInsert",
                story: Abridgers.STORY(inserted),
            });

            // Assume the new Story is included in the current Series/Volume
            inserted.ordinal = theStory.ordinal; // Carry ordinal (if any) forward
            await performInclude(inserted);

            // Assume that the Author(s) for this Series/Volume wrote this Story as well
            if ((props.parent instanceof Series) || (props.parent instanceof Volume)) {
                for (const author of props.parent.authors) {
                    await AuthorClient.storiesInclude(props.library.id, author.id, inserted.id, author.principal);
                    logger.info({
                        context: "useMutateStory.performInsert",
                        msg: "Adding Story Author",
                        story: Abridgers.STORY(inserted),
                        author: Abridgers.AUTHOR(author),
                    });
                }
            }

        } catch (error) {
            logger.error({
                context: "useMutateStory.performInsert",
                library: Abridgers.LIBRARY(props.library),
                parent: Abridgers.ANY(props.parent),
                story: Abridgers.STORY(inserted),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return inserted;

    }

    const performRemove = async (theStory: Story): Promise<Story> => {

        setError(null);
        setProcessing(true);
        let removed = new Story({library_id: props.library.id});

        try {
            removed = await StoryClient.remove(props.library.id, theStory.id);
            logger.info({
                context: "useMutateStory.performRemove",
                story: Abridgers.STORY(removed),
            });
        } catch (error) {
            logger.error({
                context: "useMutateStory.performRemove",
                story: Abridgers.STORY(theStory),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return removed;

    }

    const performUpdate = async (theStory: Story): Promise<Story> => {

        setError(null);
        setProcessing(true);
        let updated = new Story({library_id: props.library.id});

        try {

            // Persist the updated Story
            updated = await StoryClient.update(props.library.id, theStory.id, theStory);
            logger.info({
                context: "useMutateStory.performUpdate",
                story: Abridgers.STORY(updated),
            });

            // If the principal changed, remove and insert to update it
            if ((props.parent instanceof Series) && props.story && (theStory.ordinal !== props.story.ordinal)) {
                logger.info({
                    context: "useMutateStory.performUpdate",
                    msg: "Reregister Series-Story for new ordinal",
                    series: Abridgers.ANY(props.parent),
                    story: Abridgers.STORY(updated),
                });
                try {
                    await SeriesClient.storiesExclude(props.library.id, props.parent.id, theStory.id);
                    await SeriesClient.storiesInclude(props.library.id, props.parent.id, theStory.id, theStory.ordinal);
                } catch (error) {
                    // Ignore errors
                }
            }

        } catch (error) {
            logger.error({
                context: "useMutateStory.performUpdate",
                story: Abridgers.STORY(theStory),
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

export default useMutateStory;
