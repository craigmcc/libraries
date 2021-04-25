// UserClient ----------------------------------------------------------------

// Interact with User related server operations.

// Internal Modules ----------------------------------------------------------

import ApiBase from "./ApiBase";
import {queryParameters} from "../util/query-parameters";

const USERS_BASE = "/users";

// Public Objects ------------------------------------------------------------

export class UserClient {

    async active<User>(params?: object): Promise<User[]> {
        return (await ApiBase.get(USERS_BASE
            + `/active${queryParameters(params)}`, params)).data;
    }

    async all<User>(params?: object): Promise<User[]> {
        return (await ApiBase.get(USERS_BASE
            + `${queryParameters(params)}`)).data;
    }

    async exact<User>(name: string, params?: object): Promise<User> {
        return (await ApiBase.get(USERS_BASE
            + `/exact/${name}${queryParameters(params)}`)).data;
    }

    async find<User>(libraryId: number, params?: Object): Promise<User> {
        return (await ApiBase.get(USERS_BASE
            + `/${libraryId}${queryParameters(params)}`)).data;
    }

    async insert<User>(library: User): Promise<User> {
        return (await ApiBase.post(USERS_BASE, library)).data;
    }

    async name<User>(name: string, params?: object): Promise<User[]> {
        return (await ApiBase.get(USERS_BASE
            + `/name/${name}${queryParameters(params)}`)).data;
    }

    async remove<User>(libraryId: number): Promise<User> {
        return (await ApiBase.delete(USERS_BASE + `/${libraryId}`)).data;
    }

    async update<User>(libraryId: number, library: User): Promise<User> {
        return (await ApiBase.put(USERS_BASE
            + `/${libraryId}`, library)).data;
    }

}

export default new UserClient();
