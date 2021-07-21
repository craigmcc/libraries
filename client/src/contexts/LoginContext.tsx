// LoginContext --------------------------------------------------------------

// React Context containing information about the currently logged in user
// (if there is one).  If there is no logged in user, the loggedIn flag
// will be false.

// Separately, key context state values are copied to exported
// static variables that are accessible outside the component hierarchy.

// An allowed scope of "log:xxxxx" translates into a call to setLevel("xxxxx")
// to set the logging level for this user.  If not present, defaults to "info".

// External Modules ----------------------------------------------------------

import React, { createContext, useState } from "react";

// Internal Modules ----------------------------------------------------------

import TokenResponse from "../models/TokenResponse";
import logger, {setLevel} from "../util/client-logger";

// Context Properties --------------------------------------------------------

export type LoginContextState = {
    accessToken: string | null;
    expires: Date | null;
    loggedIn: boolean;
    refreshToken: string | null;
    scope: string | null;
    username: string | null;
}

export type LoginContextData = {
    state: LoginContextState;
    handleLogin: (username: string, tokenResponse: TokenResponse) => void;
    handleLogout: () => void;
    validateScope: (scope: string) => boolean;
}

export const LoginContext = createContext<LoginContextData>({
    state: {
        accessToken: null,
        expires: null,
        loggedIn: false,
        refreshToken: null,
        scope: null,
        username: null,
    },
    handleLogin: (username, tokenResponse): void => {},
    handleLogout: (): void => {},
    validateScope: (scope: string): boolean => { return false }
});

export default LoginContext;

// Context Provider ----------------------------------------------------------

// For use by HTTP clients to include in their requests
export let CURRENT_TOKEN: TokenResponse | null = null;

let CURRENT_ALLOWED: string[] = [];     // Currently allowed scope(s)
let CURRENT_LOG_LEVEL = "info";         // Currently assigned log level
const LOG_PREFIX = "log:";              // Prefix for checking scope values

export const LoginContextProvider = (props: any) => {

    const [state, setState] = useState<LoginContextState>({
        accessToken: null,
        expires: null,
        loggedIn: false,
        refreshToken: null,
        scope: null,
        username: null,
    });

/*
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [expires, setExpires] = useState<Date | null>(null);
    const [loggedIn, setLoggedIn] = useState<boolean>(false);
    const [refreshToken, setRefreshToken] = useState<string | null>(null);
    const [scope, setScope] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);
*/

    const handleLogin = async (newUsername: string, tokenResponse: TokenResponse): Promise<void> => {

        logger.info({
            context: "LoginContext.handleLogin",
            username: newUsername,
            tokenResponse: tokenResponse,
        });

        // Set relevant state variables
        const newExpires: Date = new Date
            ((new Date()).getTime() + (tokenResponse.expires_in * 1000));
        setState({
            accessToken: tokenResponse.access_token,
            expires: newExpires,
            loggedIn: true,
            refreshToken: tokenResponse.refresh_token
                ? tokenResponse.refresh_token : null,
            scope: tokenResponse.scope,
            username: newUsername
        });

        // Set local statics for later use
        CURRENT_ALLOWED = [];
        CURRENT_LOG_LEVEL = "info";
        if (tokenResponse.scope) {
            tokenResponse.scope.split(" ").forEach(allowed => {
                if (allowed.startsWith(LOG_PREFIX)) {
                    CURRENT_LOG_LEVEL = allowed.substr(LOG_PREFIX.length);
                } else {
                    CURRENT_ALLOWED.push(allowed);
                }
            })
        }
        setLevel(CURRENT_LOG_LEVEL);
        logger.info({
            context: "LoginContext.handleLogin",
            msg: "Successful completion",
            allowed: CURRENT_ALLOWED,
            log_level: CURRENT_LOG_LEVEL
        });

        // Set global statics for non-component access to current values
        CURRENT_TOKEN = tokenResponse;

    }

    const handleLogout = async (): Promise<void> => {

        logger.info({
            context: "LoginContext.handleLogout",
            username: state.username,
        });

        // Reset state values to reflect logout
        setState({
            accessToken: null,
            expires: null,
            loggedIn: false,
            refreshToken: null,
            scope: null,
            username: null,
        })

        // Reset local and global statics
        CURRENT_ALLOWED = [];
        CURRENT_TOKEN = null;
        setLevel("info");

    }

    // Return true if there is a logged in user that has the required
    // scope being requested
    const validateScope = (required: string): boolean => {

        // Users not logged in will never pass scope requirements
        if (!state.loggedIn) {
            return false;
        }

        // Handle superuser scope
        if (CURRENT_ALLOWED.includes("superuser")) {
            return true;
        }

        // Handle request for logged in user with any scope
        if (required === "") {
            return true;
        }

        // Otherwise, check required scope versus allowed scope
        let requiredScopes: string[]
            = required ? required.split(" ") : [];
        if (requiredScopes.length === 0) {
            return true;
        }
        requiredScopes.forEach(requiredScope => {
            if (!CURRENT_ALLOWED.includes(requiredScope)) {
                return false;
            }
        });
        return true;

    }

    // Create the context object
    const loginContext: LoginContextData = {
        state: state,
        handleLogin: handleLogin,
        handleLogout: handleLogout,
        validateScope: validateScope,
    }

    // Return the context, rendering children inside
    return (
        <LoginContext.Provider value={loginContext}>
            {props.children}
        </LoginContext.Provider>
    )

}
