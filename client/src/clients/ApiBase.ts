// ApiBase -------------------------------------------------------------------

// Basic infrastructure for Axios interactions with the API routes
// of an application server, rooted at "/api".

// External Modules ----------------------------------------------------------

import axios, { AxiosInstance } from "axios";

// Internal Modules ----------------------------------------------------------

import {CURRENT_TOKEN} from "../contexts/LoginContext";

// Private Objects -----------------------------------------------------------

// Public Objects ------------------------------------------------------------

const ApiBase: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
});

ApiBase.interceptors.request.use(function (config) {
    if (CURRENT_TOKEN && CURRENT_TOKEN.access_token) {
        config.headers["Authorization"] = `Bearer ${CURRENT_TOKEN.access_token}`;
    }
    return config;
})

export default ApiBase;
