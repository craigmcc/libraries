// OAuthClient ---------------------------------------------------------------

// HTTP Client for an OAuth Authorization Server.

// External Modules ----------------------------------------------------------

import qs from "qs";

// Internal Modules ----------------------------------------------------------

import OAuthBase from "./OAuthBase";
import {CURRENT_TOKEN, CURRENT_USER} from "../contexts/LoginContext";
import PasswordTokenRequest from "../models/PasswordTokenRequest";
import RefreshTokenRequest from "../models/RefreshTokenRequest";
import logger from "../util/client-logger";

// Public Objects ------------------------------------------------------------

class OAuthClient {

    async me<User>(): Promise<User> {
        const headers: any = {
            "Authorization": (CURRENT_TOKEN && CURRENT_TOKEN.access_token)
                ? `Bearer ${CURRENT_TOKEN.access_token}` : undefined,
            "X-LIB-Username": (CURRENT_USER && CURRENT_USER.username)
                ? `${CURRENT_USER.username}` : undefined,
        }
        logger.info({
            context: "OAuthClient.me",
            msg: "Requesting 'me' information",
            headers: headers,
        })
        const response = await OAuthBase.get("/token", {
            headers: headers,
        });
        logger.info({
            context: "OAuthClient.me",
            msg: "Returning 'me' information",
            response: JSON.stringify(response.data),
        });
        return response.data;
    }

    async password<TokenResponse>(passwordTokenRequest: PasswordTokenRequest)
            : Promise<TokenResponse> {
        logger.info({
            context: "OAuthClient.password",
            msg: "Sending password authorization request",
            username: passwordTokenRequest.username
        })
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
        const headers: any = {
            "Authorization": (CURRENT_TOKEN && CURRENT_TOKEN.access_token)
                ? `Bearer ${CURRENT_TOKEN.access_token}` : undefined,
            "X-LIB-Username": (CURRENT_USER && CURRENT_USER.username)
                ? `${CURRENT_USER.username}` : undefined,
        }
        logger.info({
            context: "OAuthClient.revoke",
            headers: JSON.stringify(headers),
        })
        await OAuthBase.delete(`/token`, {
            headers: headers
        });
    }

}

export default new OAuthClient();
