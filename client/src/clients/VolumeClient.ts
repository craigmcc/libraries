// VolumeClient --------------------------------------------------------------

// Interact with Volume related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";
import Author from "../models/Author";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {toAuthors, toStories, toVolume, toVolumes} from "../util/to-model-types";

const VOLUMES_BASE = "/volumes";

// Public Objects ------------------------------------------------------------

export class VolumeClient {

    async active(libraryId: number, params?: object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(VOLUMES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
        return toVolumes(values);
    }

    async all(libraryId: number, params?: object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(VOLUMES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
        return toVolumes(values);
    }

    async authors(libraryId: number, volumeId: number, params?: Object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(VOLUMES_BASE
            + `/${libraryId}/${volumeId}/authors${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async exact(libraryId: number, name: string, params?: object): Promise<Volume>
    {
        const value = (await ApiBase.get<Volume>(VOLUMES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
        return toVolume(value);
    }

    async find(libraryId: number, volumeId: number, params?: Object): Promise<Volume> {
        const value = (await ApiBase.get<Volume>(VOLUMES_BASE
            + `/${libraryId}/${volumeId}${queryParameters(params)}`)).data;
        return toVolume(value);
    }

    async insert(libraryId: number, volume: Volume): Promise<Volume> {
        const value =
            (await ApiBase.post<Volume>(VOLUMES_BASE + `/${libraryId}`, volume)).data;
        return toVolume(value);
    }

    async name(libraryId: number, name: string, params?: object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(VOLUMES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
        return toVolumes(values);
    }

    async remove(libraryId: number, volumeId: number): Promise<Volume> {
        const value =
            (await ApiBase.delete<Volume>(VOLUMES_BASE + `/${libraryId}/${volumeId}`)).data;
        return toVolume(value);
    }

    async stories(libraryId: number, volumeId: number, params?: Object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(VOLUMES_BASE
            + `/${libraryId}/${volumeId}/stories${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async update(libraryId: number, volumeId: number, volume: Volume): Promise<Volume> {
        const value = (await ApiBase.put<Volume>(VOLUMES_BASE
            + `/${libraryId}/${volumeId}`, volume)).data;
        return toVolume(value);
    }

}

export default new VolumeClient();
