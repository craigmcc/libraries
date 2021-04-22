// OAuthClient ---------------------------------------------------------------

// HTTP Client for an OAuth Authorization Server.

// External Modules ----------------------------------------------------------

import qs from "qs";

// Internal Modules ----------------------------------------------------------

import OAuthBase from "./OAuthBase";
import PasswordTokenRequest from "../models/PasswordTokenRequest";
import RefreshTokenRequest from "../models/RefreshTokenRequest";

import {CURRENT_TOKEN, CURRENT_USER} from "../contexts/LoginContext";

// Public Objects ------------------------------------------------------------

class OAuthClient {

    async me<User>(): Promise<User> {
        return (await OAuthBase.get("/token", {
            headers: {
                "Authorization": (CURRENT_TOKEN && CURRENT_TOKEN.access_token)
                    ? `Bearer ${CURRENT_TOKEN.access_token}` : undefined,
                "X-LIB-Username": (CURRENT_USER && CURRENT_USER.username)
                    ? `${CURRENT_USER.username}` : undefined,
            }
        })).data;
    }

    async password<TokenResponse>(passwordTokenRequest: PasswordTokenRequest)
            : Promise<TokenResponse> {
        // Token requests are URL-encoded, not JSON
        const encodedRequest = qs.stringify(passwordTokenRequest);
        return (await OAuthBase.post("/token", encodedRequest, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        })).data;
    }

    async refresh<TokenResponse>(refreshTokenRequest: RefreshTokenRequest)
            : Promise<TokenResponse> {
        // Token requests are URL-encoded, not JSON
        const encodedRequest = qs.stringify(refreshTokenRequest);
        return (await OAuthBase.post("/token", encodedRequest, {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )).data;
    }

    async revoke(): Promise<void> {
        await OAuthBase.delete(`/token`, {
            headers: {
                "Authorization": (CURRENT_TOKEN && CURRENT_TOKEN.access_token)
                    ? `Bearer ${CURRENT_TOKEN.access_token}` : undefined,
                "X-LIB-Username": (CURRENT_USER && CURRENT_USER.username)
                    ? `${CURRENT_USER.username}` : undefined,
            }
        });
    }

}

export default new OAuthClient();
