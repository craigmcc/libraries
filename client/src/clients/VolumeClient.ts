// VolumeClient --------------------------------------------------------------

// Interact with Volume related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";

const VOLUMES_BASE = "/volumes";

// Public Objects ------------------------------------------------------------

export class VolumeClient {

    async active<Volume>(libraryId: number, params?: object): Promise<Volume[]> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
    }

    async all<Volume>(libraryId: number, params?: object): Promise<Volume[]> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async authors<Volume>(libraryId: number, volumeId: number, params?: Object): Promise<Volume[]> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/${volumeId}/authors${queryParameters(params)}`)).data;
    }

    async exact<Volume>(libraryId: number, name: string, params?: object): Promise<Volume>
    {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
    }

    async find<Volume>(libraryId: number, volumeId: number, params?: Object): Promise<Volume> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/${volumeId}${queryParameters(params)}`)).data;
    }

    async insert<Volume>(libraryId: number, volume: Volume): Promise<Volume> {
        return (await ApiBase.post(VOLUMES_BASE + `/${libraryId}`, volume)).data;
    }

    async name<Volume>(libraryId: number, name: string, params?: object): Promise<Volume[]> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<Volume>(libraryId: number, volumeId: number): Promise<Volume> {
        return (await ApiBase.delete(VOLUMES_BASE + `/${libraryId}/${volumeId}`)).data;
    }

    async stories<Story>(libraryId: number, volumeId: number, params?: Object): Promise<Story[]> {
        return (await ApiBase.get(VOLUMES_BASE
            + `/${libraryId}/${volumeId}/stories${queryParameters(params)}`)).data;
    }

    async update<Volume>(libraryId: number, volumeId: number, volume: Volume): Promise<Volume> {
        return (await ApiBase.put(VOLUMES_BASE
            + `/${libraryId}/${volumeId}`, volume)).data;
    }

}

export default new VolumeClient();
