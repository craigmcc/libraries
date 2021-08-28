// useMutateVolume -----------------------------------------------------------

// Custom hook to encapsulate operations that insert/remove/update a Volume.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import StoryClient from "../clients/StoryClient";
import VolumeClient from "../clients/VolumeClient";
import Author from "../models/Author";
import Library from "../models/Library";
import Story from "../models/Story";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;                   // Library for which to process data
    parent: Author | Library | Story;   // Currently selected Author/Story
}

// Component Details ---------------------------------------------------------

const useMutateVolume = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [processing, setProcessing] = useState<boolean>(false);

    useEffect(() => {
        logger.info({
            context: "useMutateVolume.useEffect",
            library: Abridgers.LIBRARY(props.library),
            parent: Abridgers.ANY(props.parent),
        });
    }, [props.library, props.parent]);

    const performExclude = async(theVolume: Volume): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.volumesExclude(props.library.id, props.parent.id, theVolume.id);
                logger.info({
                    context: "useMutateVolume.performExclude",
                    author: Abridgers.AUTHOR(props.parent),
                    volume: Abridgers.VOLUME(theVolume),
                });
            } else if (props.parent instanceof Story) {
                await VolumeClient.storiesExclude(props.library.id, theVolume.id, props.parent.id);
                logger.info({
                    context: "useMutateVolume.performExclude",
                    story: Abridgers.STORY(props.parent),
                    volume: Abridgers.VOLUME(theVolume),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateVolume.performExclude",
                library: Abridgers.LIBRARY(props.library),
                parent: Abridgers.ANY(props.parent),
                volume: Abridgers.VOLUME(theVolume),
            })
        }
        setProcessing(false);
    }

    const performInclude = async(theVolume: Volume): Promise<void> => {
        setError(null);
        setProcessing(true);
        try {
            if (props.parent instanceof Author) {
                await AuthorClient.volumesInclude(props.library.id, props.parent.id, theVolume.id, props.parent.principal);
                logger.info({
                    context: "useMutateVolume.performInclude",
                    author: Abridgers.AUTHOR(props.parent),
                    volume: Abridgers.VOLUME(theVolume),
                });
            } else if (props.parent instanceof Story) {
                await VolumeClient.storiesInclude(props.library.id, theVolume.id, props.parent.id);
                logger.info({
                    context: "useMutateVolume.performExclude",
                    story: Abridgers.STORY(props.parent),
                    volume: Abridgers.VOLUME(theVolume),
                });
            }
            // else no-op if props.parent instanceof Library
        } catch (error) {
            logger.error({
                context: "useMutateVolume.performInclude",
                library: Abridgers.LIBRARY(props.library),
                parent: Abridgers.ANY(props.parent),
                volume: Abridgers.VOLUME(theVolume),
            })
        }
        setProcessing(false);
    }

    const performInsert = async (theVolume: Volume): Promise<Volume> => {

        setError(null);
        setProcessing(true);
        let inserted = new Volume({library_id: props.library.id});
        let added = new Story({library_id: props.library.id});

        try {

            // Persist the requested Volume
            inserted = await VolumeClient.insert(props.library.id, theVolume);
            logger.info({
                context: "useMutateVolume.performInsert",
                msg: "Inserted Volume",
                volume: Abridgers.VOLUME(inserted),
            });

            // If this Volume is of type "Single", create a Story with the same name
            // and associate it with this Volume
            if (inserted.type === "Single") {
                const theStory = new Story({
                    copyright: inserted.copyright ? inserted.copyright : undefined,
                    library_id: inserted.library_id,
                    name: inserted.name,
                    notes: inserted.notes ? inserted.notes : undefined,
                });
                added = await StoryClient.insert(props.library.id, theStory);
                await VolumeClient.storiesInclude(props.library.id, inserted.id, added.id);
                logger.info({
                    context: "useMutateVolume.performInsert",
                    msg: "Added Story",
                    story: Abridgers.STORY(added),
                });
            }

        } catch (error) {
            logger.error({
                context: "useMutateVolume.performInsert",
                library: Abridgers.LIBRARY(props.library),
                volume: Abridgers.VOLUME(inserted),
                story: Abridgers.STORY(added),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return inserted;

    }

    const performRemove = async (theVolume: Volume): Promise<Volume> => {

        setError(null);
        setProcessing(true);
        let removed = new Volume({library_id: props.library.id});

        try {
            removed = await VolumeClient.remove(props.library.id, theVolume.id);
            logger.info({
                context: "useMutateVolume.performRemove",
                volume: Abridgers.VOLUME(removed),
            });
        } catch (error) {
            logger.error({
                context: "useMutateVolume.performRemove",
                volume: Abridgers.VOLUME(theVolume),
                error: error,
            });
            setError(error);
        }

        setProcessing(false);
        return removed;

    }

    const performUpdate = async (theVolume: Volume): Promise<Volume> => {

        setError(null);
        setProcessing(true);
        let updated = new Volume({library_id: props.library.id});

        try {
            updated = await VolumeClient.update(props.library.id, theVolume.id, theVolume);
            logger.info({
                context: "useMutateVolume.performUpdate",
                volume: Abridgers.VOLUME(updated),
            });
        } catch (error) {
            logger.error({
                context: "useMutateVolume.performUpdate",
                volume: Abridgers.VOLUME(theVolume),
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

export default useMutateVolume;
