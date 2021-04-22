// LibraryClient -------------------------------------------------------------

// Interact with Library related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import Author from "../models/Author";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {queryParameters} from "../util/query-parameters";

const LIBRARIES_BASE = "/libraries";

// Public Objects ------------------------------------------------------------

class LibraryClient {

    async active<Library>(params?: object): Promise<Library[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/active${queryParameters(params)}`, params)).data;
    }

    async all<Library>(params?: object): Promise<Library[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `${queryParameters(params)}`)).data;
    }

    async authors<Library>(libraryId: number, params?: Object): Promise<Author[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async exact<Library>(name: string, params?: object): Promise<Library> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/exact/${name}${queryParameters(params)}`)).data;
    }

    async find<Library>(libraryId: number, params?: Object): Promise<Library> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async insert<Library>(library: Library): Promise<Library> {
        return (await ApiBase.post(LIBRARIES_BASE, library)).data;
    }

    async name<Library>(name: string, params?: object): Promise<Library[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<Library>(libraryId: number): Promise<Library> {
        return (await ApiBase.delete(LIBRARIES_BASE + `/${libraryId}`)).data;
    }

    async series<Library>(libraryId: number, params?: Object): Promise<Series[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async scope<Library>(scope: string, params?: object): Promise<Library> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/scope/${scope}${queryParameters(params)}`)).data;
    }

    async stories<Library>(libraryId: number, params?: Object): Promise<Story[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async update<Library>(libraryId: number, library: Library): Promise<Library> {
        return (await ApiBase.put(LIBRARIES_BASE
            + `/${libraryId}`, library)).data;
    }

    async volumes<Library>(libraryId: number, params?: Object): Promise<Volume[]> {
        return (await ApiBase.get(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }


}

export default new LibraryClient();
