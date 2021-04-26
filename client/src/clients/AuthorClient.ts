// AuthorClient -------------------------------------------------------------

// Interact with Author related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";

const AUTHORS_BASE = "/authors";

// Public Objects ------------------------------------------------------------

export class AuthorClient {

    async active<Author>(libraryId: number, params?: object): Promise<Author[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/active${queryParameters(params)}`, params)).data;
    }

    async all<Author>(libraryId: number, params?: object): Promise<Author[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async exact<Author>
        (libraryId: number, firstName: string,
         lastName: string, params?: object): Promise<Author>
    {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/exact/${firstName}/${lastName}${queryParameters(params)}`)).data;
    }

    async find<Author>(libraryId: number, authorId: number, params?: Object): Promise<Author> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/${authorId}${queryParameters(params)}`)).data;
    }

    async insert<Author>(libraryId: number, author: Author): Promise<Author> {
        return (await ApiBase.post(AUTHORS_BASE + `/${libraryId}`, author)).data;
    }

    async name<Author>(libraryId: number, name: string, params?: object): Promise<Author[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<Author>(libraryId: number, authorId: number): Promise<Author> {
        return (await ApiBase.delete(AUTHORS_BASE + `/${libraryId}/${authorId}`)).data;
    }

    async series<Series>(libraryId: number, authorId: number, params?: Object): Promise<Series[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/${authorId}/series${queryParameters(params)}`)).data;
    }

    async stories<Story>(libraryId: number, authorId: number, params?: Object): Promise<Story[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/${authorId}/stories${queryParameters(params)}`)).data;
    }

    async update<Author>(libraryId: number, authorId: number, author: Author): Promise<Author> {
        return (await ApiBase.put(AUTHORS_BASE
            + `/${libraryId}/${authorId}`, author)).data;
    }

    async volumes<Volume>(libraryId: number, authorId: number, params?: Object): Promise<Volume[]> {
        return (await ApiBase.get(AUTHORS_BASE
            + `/${libraryId}/${authorId}/volumes${queryParameters(params)}`)).data;
    }

}

export default new AuthorClient();
