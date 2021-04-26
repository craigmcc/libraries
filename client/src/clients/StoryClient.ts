// StoryClient ---------------------------------------------------------------

// Interact with Story related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";

const STORIES_BASE = "/stories";

// Public Objects ------------------------------------------------------------

export class StoryClient {

    async active<Story>(libraryId: number, params?: object): Promise<Story[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
    }

    async all<Story>(libraryId: number, params?: object): Promise<Story[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async authors<Story>(libraryId: number, storyId: number, params?: Object): Promise<Story[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/${storyId}/authors${queryParameters(params)}`)).data;
    }

    async exact<Story>(libraryId: number, name: string, params?: object): Promise<Story>
    {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
    }

    async find<Story>(libraryId: number, storyId: number, params?: Object): Promise<Story> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/${storyId}${queryParameters(params)}`)).data;
    }

    async insert<Story>(libraryId: number, story: Story): Promise<Story> {
        return (await ApiBase.post(STORIES_BASE + `/${libraryId}`, story)).data;
    }

    async name<Story>(libraryId: number, name: string, params?: object): Promise<Story[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<Story>(libraryId: number, storyId: number): Promise<Story> {
        return (await ApiBase.delete(STORIES_BASE + `/${libraryId}/${storyId}`)).data;
    }

    async series<Series>(libraryId: number, storyId: number, params?: Object): Promise<Series[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/${storyId}/series${queryParameters(params)}`)).data;
    }

    async update<Story>(libraryId: number, storyId: number, story: Story): Promise<Story> {
        return (await ApiBase.put(STORIES_BASE
            + `/${libraryId}/${storyId}`, story)).data;
    }

    async volumes<Volume>(libraryId: number, storyId: number, params?: Object): Promise<Volume[]> {
        return (await ApiBase.get(STORIES_BASE
            + `/${libraryId}/${storyId}/volumes${queryParameters(params)}`)).data;
    }

}

export default new StoryClient();
