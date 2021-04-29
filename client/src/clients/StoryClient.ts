// StoryClient ---------------------------------------------------------------

// Interact with Story related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import Author from "../models/Author";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {queryParameters} from "../util/query-parameters";
import {
    toAuthors,
    toSerieses,
    toStories,
    toStory,
    toVolumes,
} from "../util/to-model-types";

const STORIES_BASE = "/stories";

// Public Objects ------------------------------------------------------------

export class StoryClient {

    async active(libraryId: number, params?: object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(STORIES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
        return toStories(values);
    }

    async all(libraryId: number, params?: object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(STORIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async authors(libraryId: number, storyId: number, params?: Object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(STORIES_BASE
            + `/${libraryId}/${storyId}/authors${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async exact(libraryId: number, name: string, params?: object): Promise<Story> {
        const value = (await ApiBase.get<Story>(STORIES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
        return toStory(value);
    }

    async find(libraryId: number, storyId: number, params?: Object): Promise<Story> {
        const value = (await ApiBase.get<Story>(STORIES_BASE
            + `/${libraryId}/${storyId}${queryParameters(params)}`)).data;
        return toStory(value);
    }

    async insert(libraryId: number, story: Story): Promise<Story> {
        const value = (await ApiBase.post<Story>(STORIES_BASE
            + `/${libraryId}`, story)).data;
        return toStory(value);
    }

    async name(libraryId: number, name: string, params?: object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(STORIES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async remove(libraryId: number, storyId: number): Promise<Story> {
        const value = (await ApiBase.delete<Story>(STORIES_BASE
            + `/${libraryId}/${storyId}`)).data;
        return toStory(value);
    }

    async series(libraryId: number, storyId: number, params?: Object): Promise<Series[]> {
        const values = (await ApiBase.get<Series[]>(STORIES_BASE
            + `/${libraryId}/${storyId}/series${queryParameters(params)}`)).data;
        return toSerieses(values);
    }

    async update(libraryId: number, storyId: number, story: Story): Promise<Story> {
        const value = (await ApiBase.put<Story>(STORIES_BASE
            + `/${libraryId}/${storyId}`, story)).data;
        return toStory(value);
    }

    async volumes(libraryId: number, storyId: number, params?: Object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(STORIES_BASE
            + `/${libraryId}/${storyId}/volumes${queryParameters(params)}`)).data;
        return toVolumes(values);
    }

}

export default new StoryClient();
