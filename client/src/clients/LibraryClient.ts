// LibraryClient -------------------------------------------------------------

// Interact with Library related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import Author from "../models/Author";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import {queryParameters} from "../util/query-parameters";
import {
    toAuthors,
    toLibraries,
    toLibrary,
    toSerieses,
    toStories,
    toVolumes,
} from "../util/to-model-types";

const LIBRARIES_BASE = "/libraries";

// Public Objects ------------------------------------------------------------

export class LibraryClient {

    async active(params?: object): Promise<Library[]> {
        const values = (await ApiBase.get<Library[]>(LIBRARIES_BASE
            + `/active${queryParameters(params)}`, params)).data;
        return toLibraries(values);
    }

    async all(params?: object): Promise<Library[]> {
        const values = (await ApiBase.get<Library[]>(LIBRARIES_BASE
            + `${queryParameters(params)}`)).data;
        return toLibraries(values);
    }

    async authors(libraryId: number, params?: Object): Promise<Author[]> {
        const values = (await ApiBase.get<Author[]>(LIBRARIES_BASE
            + `/${libraryId}/authors${queryParameters(params)}`)).data;
        return toAuthors(values);
    }

    async exact(name: string, params?: object): Promise<Library> {
        const value = (await ApiBase.get<Library>(LIBRARIES_BASE
            + `/exact/${name}${queryParameters(params)}`)).data;
        return toLibrary(value);
    }

    async find(libraryId: number, params?: Object): Promise<Library> {
        const value = (await ApiBase.get<Library>(LIBRARIES_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
        return toLibrary(value);
    }

    async insert(library: Library): Promise<Library> {
        const value = (await ApiBase.post<Library>(LIBRARIES_BASE, library)).data;
        return toLibrary(value);
    }

    async name(name: string, params?: object): Promise<Library[]> {
        const values = (await ApiBase.get<Library[]>(LIBRARIES_BASE
            + `/name/${name}${queryParameters(params)}`)).data;
        return toLibraries(values);
    }

    async remove(libraryId: number): Promise<Library> {
        const value =
            (await ApiBase.delete<Library>(LIBRARIES_BASE + `/${libraryId}`)).data;
        return toLibrary(value);
    }

    async series(libraryId: number, params?: Object): Promise<Series[]> {
        const values = (await ApiBase.get<Series[]>(LIBRARIES_BASE
            + `/${libraryId}/series${queryParameters(params)}`)).data;
        return toSerieses(values);
    }

    async stories(libraryId: number, params?: Object): Promise<Story[]> {
        const values = (await ApiBase.get<Story[]>(LIBRARIES_BASE
            + `/${libraryId}/stories${queryParameters(params)}`)).data;
        return toStories(values);
    }

    async update(libraryId: number, library: Library): Promise<Library> {
        const value = (await ApiBase.put<Library>(LIBRARIES_BASE
            + `/${libraryId}`, library)).data;
        return toLibrary(value);
    }

    async volumes(libraryId: number, params?: Object): Promise<Volume[]> {
        const values = (await ApiBase.get<Volume[]>(LIBRARIES_BASE
            + `/${libraryId}/volumes${queryParameters(params)}`)).data;
        return toVolumes(values);
    }

}

export default new LibraryClient();
