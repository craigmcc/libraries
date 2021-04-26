// SeriesClient --------------------------------------------------------------

// Interact with Series related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";

const SERIES_BASE = "/series";

// Public Objects ------------------------------------------------------------

export class SeriesClient {

    async active<Series>(libraryId: number, params?: object): Promise<Series[]> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
    }

    async all<Series>(libraryId: number, params?: object): Promise<Series[]> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async authors<Series>(libraryId: number, seriesId: number, params?: Object): Promise<Series[]> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/${seriesId}/authors${queryParameters(params)}`)).data;
    }

    async exact<Series>(libraryId: number, name: string, params?: object): Promise<Series>
    {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/exact/${name}${queryParameters(params)}`)).data;
    }

    async find<Series>(libraryId: number, seriesId: number, params?: Object): Promise<Series> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/${seriesId}${queryParameters(params)}`)).data;
    }

    async insert<Series>(libraryId: number, series: Series): Promise<Series> {
        return (await ApiBase.post(SERIES_BASE + `/${libraryId}`, series)).data;
    }

    async name<Series>(libraryId: number, name: string, params?: object): Promise<Series[]> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<Series>(libraryId: number, seriesId: number): Promise<Series> {
        return (await ApiBase.delete(SERIES_BASE + `/${libraryId}/${seriesId}`)).data;
    }

    async stories<Story>(libraryId: number, seriesId: number, params?: Object): Promise<Story[]> {
        return (await ApiBase.get(SERIES_BASE
            + `/${libraryId}/${seriesId}/stories${queryParameters(params)}`)).data;
    }

    async update<Series>(libraryId: number, seriesId: number, series: Series): Promise<Series> {
        return (await ApiBase.put(SERIES_BASE
            + `/${libraryId}/${seriesId}`, series)).data;
    }

}

export default new SeriesClient();
