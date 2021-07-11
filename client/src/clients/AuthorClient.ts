// AuthorClient --------------------------------------------------------------

// Interact with Author related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import Author from "../models/Author";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {queryParameters} from "../util/query-parameters";
import {
    toAuthor,
    toAuthors,
    toSeries,
    toSerieses,
    toStories,
    toStory,
    toVolume,
    toVolumes,
} from "../util/to-model-types";

const AUTHORS_BASE = "/authors";

// Public Objects ------------------------------------------------------------

export class AuthorClient {

    async active(libraryId: number, params?: object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(AUTHORS_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
        return toAuthors(values);
    }

    async all(libraryId: number, params?: object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(AUTHORS_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async exact(libraryId: number, firstName: string,
         lastName: string, params?: object): Promise<Author>
    {
        const value = (await ApiBase.get<Author>(AUTHORS_BASE
            + `/${libraryId}/exact/${firstName}/${lastName}${queryParameters(params)}`)).data;
        return toAuthor(value);
    }

    async find(libraryId: number, authorId: number, params?: Object): Promise<Author> {
        const value = (await ApiBase.get<Author>(AUTHORS_BASE
            + `/${libraryId}/${authorId}${queryParameters(params)}`)).data;
        return toAuthor(value);
    }

    async insert(libraryId: number, author: Author): Promise<Author> {
        const value =
            (await ApiBase.post<Author>(AUTHORS_BASE + `/${libraryId}`, author)).data;
        return toAuthor(value);
    }

    async name(libraryId: number, name: string, params?: object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(AUTHORS_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async remove(libraryId: number, authorId: number): Promise<Author> {
        const value =
            (await ApiBase.delete<Author>(AUTHORS_BASE + `/${libraryId}/${authorId}`)).data;
        return toAuthor(value);
    }

    async series(libraryId: number, authorId: number, params?: Object): Promise<Series[]> {
        const values = (await ApiBase.get<Series[]>(AUTHORS_BASE
            + `/${libraryId}/${authorId}/series${queryParameters(params)}`)).data;
        return toSerieses(values);
    }

    async seriesExclude(libraryId: number, authorId: number, seriesId: number): Promise<Series> {
        const value = await ApiBase.delete(AUTHORS_BASE
            + `/${libraryId}/${authorId}/series/${seriesId}`);
        return toSeries(value);
    }

    async seriesInclude(libraryId: number, authorId: number, seriesId: number, principal: boolean | null): Promise<Series> {
        let url = AUTHORS_BASE + `/${libraryId}/${authorId}/series/${seriesId}`;
        if (principal) {
            url += '?principal=true';
        }
        const value = await ApiBase.post(url);
        return toSeries(value);
    }

    async stories(libraryId: number, authorId: number, params?: Object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(AUTHORS_BASE
            + `/${libraryId}/${authorId}/stories${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async storiesExclude(libraryId: number, authorId: number, storyId: number): Promise<Story> {
        const value = await ApiBase.delete(AUTHORS_BASE
            + `/${libraryId}/${authorId}/stories/${storyId}`);
        return toStory(value);
    }

    async storiesInclude(libraryId: number, authorId: number, storyId: number, principal: boolean | null): Promise<Story> {
        let url = AUTHORS_BASE + `/${libraryId}/${authorId}/stories/${storyId}`;
        if (principal) {
            url += '?principal=true';
        }
        const value = await ApiBase.post(url);
        return toStory(value);
    }

    async update(libraryId: number, authorId: number, author: Author): Promise<Author> {
        const value = (await ApiBase.put<Author>(AUTHORS_BASE
            + `/${libraryId}/${authorId}`, author)).data;
        return toAuthor(value);
    }

    async volumes(libraryId: number, authorId: number, params?: Object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(AUTHORS_BASE
            + `/${libraryId}/${authorId}/volumes${queryParameters(params)}`)).data;
        return toVolumes(values);
    }

    async volumesExclude(libraryId: number, authorId: number, volumeId: number): Promise<Volume> {
        const value = await ApiBase.delete(AUTHORS_BASE
            + `/${libraryId}/${authorId}/volumes/${volumeId}`);
        return toVolume(value);
    }

    async volumesInclude(libraryId: number, authorId: number, volumeId: number, principal: boolean | null): Promise<Volume> {
        let url = AUTHORS_BASE + `/${libraryId}/${authorId}/volumes/${volumeId}`;
        if (principal) {
            url += '?principal=true';
        }
        const value = await ApiBase.post(url);
        return toVolume(value);
    }

}

export default new AuthorClient();
