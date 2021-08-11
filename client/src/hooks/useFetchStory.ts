// useFetchStory -------------------------------------------------------------

// Custom hook to fetch a specified Story object, fleshed out with nested
// Author objects.

// External Modules ----------------------------------------------------------

import {useEffect, useState} from "react";

// Internal Modules ----------------------------------------------------------

import StoryClient from "../clients/StoryClient";
import Library from "../models/Library";
import Story from "../models/Story";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import * as Sorters from "../util/sorters";

// Incoming Properties -------------------------------------------------------

export interface Props {
    library: Library;                   // Library for which to select data
    storyId: number;                    // Story ID to select (if not -1)
}

// Component Details ---------------------------------------------------------

const useFetchStory = (props: Props) => {

    const [error, setError] = useState<Error | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [story, setStory] = useState<Story>(new Story());

    useEffect(() => {

        const fetchStory = async () => {

            setError(null);
            setLoading(true);

            try {
                if ((props.library.id > 0) && (props.storyId > 0)) {

                    // Fetch the requested Story with nested authors
                    const newStory = await StoryClient.find(props.library.id, props.storyId, {
                        withAuthors: "",
                    });

                    // Sort the nested authors
                    newStory.authors = Sorters.AUTHORS(newStory.authors);

                    // Cause the fetched Story to be returned
                    logger.info({
                        context: "useFetchStory.fetchStory",
                        msg: "Return fetched Story with nested Authors",
                        library: Abridgers.LIBRARY(props.library),
                        storyId: props.storyId,
                        story: Abridgers.STORY(newStory),
                    });
                    setStory(newStory);

                } else {

                    const newStory = new Story();
                    logger.info({
                        context: "useFetchStory.fetchStory",
                        msg: "Return empty Story because none selected",
                        library: Abridgers.LIBRARY(props.library),
                        storyId: props.storyId,
                        story: Abridgers.STORY(newStory),
                    })
                    setStory(newStory);

                }

            } catch (error) {
                logger.error({
                    context: "useFetchStory.fetchStory",
                    library: Abridgers.LIBRARY(props.library),
                    storyId: props.storyId,
                    error: error,
                });
                setError(error);
                setStory(new Story());
            }

            setLoading(false);

        }

        fetchStory();

    }, [props.library, props.storyId]);

    return [{story, error, loading}];

}

export default useFetchStory;
