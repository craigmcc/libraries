// OAuthAccessToken ----------------------------------------------------------

// Pseudo-database model for access tokens

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

import {NotUnique} from "../util/HttpErrors";

export class OAuthAccessToken {

    // Properties ------------------------------------------------------------

    expires!: Date;             // Expiration timestamp
    id?: number;                // Pseudo primary key
    scope!: string;             // Authorized scopes (space separated)
    token!: string;             // Access token value for this access token
    userId!: number;            // Primary key of owning user

    // Static Methods --------------------------------------------------------

    static async create
        (oauthAccessToken: OAuthAccessToken, options?: any)
        : Promise<OAuthAccessToken>
    {
        const original = ACCESS_TOKENS.get(oauthAccessToken.token);
        if (original) {
            throw new NotUnique(`token: Access token '${oauthAccessToken.token}' is already in use`);
        } else {
            oauthAccessToken.id = ++ACCESS_TOKEN_ID;
            ACCESS_TOKENS.set(oauthAccessToken.token, oauthAccessToken);
            return oauthAccessToken;
        }
    }

    static destroy = async (token: string): Promise<void> => {
        ACCESS_TOKENS.delete(token);
    }

    static async findAll(options?: any): Promise<OAuthAccessToken[]> {
        return Array.from(ACCESS_TOKENS.values());
    }

    static lookup = async (token: string): Promise<OAuthAccessToken | null> => {
        const result = ACCESS_TOKENS.get(token);
        if (result) {
            return result;
        } else {
            return null;
        }
    }

}

export default OAuthAccessToken;

// Private Objects -----------------------------------------------------------

let ACCESS_TOKEN_ID: number = 0;

// Key = access token value
const ACCESS_TOKENS: Map<string, OAuthAccessToken> = new Map();

