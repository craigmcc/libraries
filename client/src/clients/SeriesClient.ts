// SeriesClient --------------------------------------------------------------

// Interact with Series related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import Author from "../models/Author";
import Series from "../models/Series";
import Story from "../models/Story";
import {queryParameters} from "../util/query-parameters";
import {
    toAuthors,
    toSeries,
    toSerieses,
    toStories,
    toStory,
} from "../util/to-model-types";

const SERIES_BASE = "/series";

// Public Objects ------------------------------------------------------------

export class SeriesClient {

    async active(libraryId: number, params?: object): Promise<Series[]> {
        const values = (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
        return toSerieses(values);
    }

    async all(libraryId: number, params?: object): Promise<Series[]> {
        const values = (await ApiBase.get<Series[]>(SERIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
        return toSerieses(values);
    }

    async authors(libraryId: number, seriesId: number, params?: Object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(SERIES_BASE
            + `/${libraryId}/${seriesId}/authors${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async exact(libraryId: number, name: string, params?: object): Promise<Series>
    {
        const value = (await ApiBase.get<Series>(SERIES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
        return toSeries(value);
    }

    async find(libraryId: number, seriesId: number, params?: Object): Promise<Series> {
        const value = (await ApiBase.get<Series>(SERIES_BASE
            + `/${libraryId}/${seriesId}${queryParameters(params)}`)).data;
        return toSeries(value);
    }

    async insert(libraryId: number, series: Series): Promise<Series> {
        const value = (await ApiBase.post<Series>(SERIES_BASE
            + `/${libraryId}`, series)).data;
        return toSeries(value);
    }

    async name(libraryId: number, name: string, params?: object): Promise<Series[]> {
        const values = (await ApiBase.get<Series[]>(SERIES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
        return toSerieses(values);
    }

    async remove(libraryId: number, seriesId: number): Promise<Series> {
        const value = (await ApiBase.delete<Series>(SERIES_BASE
            + `/${libraryId}/${seriesId}`)).data;
        return value;
    }

    async stories(libraryId: number, seriesId: number, params?: Object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(SERIES_BASE
            + `/${libraryId}/${seriesId}/stories${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async storiesExclude(libraryId: number, seriesId: number, storyId: number): Promise<Story> {
        const value = await ApiBase.delete(SERIES_BASE
            + `/${libraryId}/${seriesId}/stories/${storyId}`);
        return toStory(value);
    }

    async storiesInclude(libraryId: number, seriesId: number, storyId: number): Promise<Story> {
        const value = await ApiBase.post(SERIES_BASE
            + `/${libraryId}/${seriesId}/stories/${storyId}`);
        return toStory(value);
    }

    async update(libraryId: number, seriesId: number, series: Series): Promise<Series> {
        const value = (await ApiBase.put<Series>(SERIES_BASE
            + `/${libraryId}/${seriesId}`, series)).data;
        return toSeries(value);
    }

}

export default new SeriesClient();
