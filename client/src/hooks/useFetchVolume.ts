// useFetchVolume ------------------------------------------------------------

// Custom hook to fetch a specified Volume object, fleshed out with nested
// Author and Story objects.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import StoryClient from "../clients/StoryClient";
import VolumeClient from "../clients/VolumeClient";
import Library from "../models/Library";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import * as Sorters from "../util/sorters";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;               // Library for which to select data
    volumeId: number;               // Volume ID to select (if not -1)
}

// Component Details ---------------------------------------------------------

const useFetchVolume = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [volume, setVolume] = useState<Volume>(new Volume());

    useEffect(() => {

        const fetchVolume = async () => {

            setError(null);
            setLoading(true);

            try {
                if ((props.library.id > 0) && (props.volumeId > 0)) {

                    // Fetch the requested Volume with nested authors and stories
                    const newVolume = await VolumeClient.find(props.library.id, props.volumeId, {
                        withAuthors: "",
                        withStories: "",
                    });

                    // Sort the nested authors and stories
                    newVolume.authors = Sorters.AUTHORS(newVolume.authors);
                    newVolume.stories = Sorters.STORIES(newVolume.stories);

                    // For each nested Story, load its associated Writers (i.e. Authors)
                    for (const story of newVolume.stories) {
                        story.authors = await StoryClient.authors(props.library.id, story.id);
                        // Server already sorted these authors appropriately
                    }

                    // Cause the fetched Volume to be returned
                    logger.info({
                        context: "useFetchVolume.fetchVolume",
                        msg: "Return fetched Volume with nested Author and Story objects",
                        library: Abridgers.LIBRARY(props.library),
                        volumeId: props.volumeId,
                        volume: Abridgers.VOLUME(newVolume),
                    });
                    setVolume(newVolume);

                } else {

                    const newVolume = new Volume();
                    logger.info({
                        context: "useFetchVolume.fetchVolume",
                        msg: "Return empty Volume because none selected",
                        library: Abridgers.LIBRARY(props.library),
                        volumeId: props.volumeId,
                        volume: Abridgers.VOLUME(newVolume),
                    });
                    setVolume(newVolume);

                }
            } catch (error) {
                logger.error({
                    context: "useFetchVolume.fetchVolume",
                    library: Abridgers.LIBRARY(props.library),
                    volumeId: props.volumeId,
                    error: error,
                });
                setError(error);
                setVolume(new Volume());
            }

            setLoading(false);

        }

        fetchVolume();

    }, [props.library, props.volumeId]);

    return [{volume, error, loading}];

}

export default useFetchVolume;
