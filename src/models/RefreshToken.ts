// OAuthRefreshToken ---------------------------------------------------------

// Pseudo-database model for refresh tokens

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

import {NotUnique} from "../util/HttpErrors";

export class RefreshToken {

    // Properties ------------------------------------------------------------

    accessToken!: string;       // Access token this refresh token belongs to
    id?: number;                // Pseudo primary key
    expires!: Date;             // Expiration timestamp
    token!: string;             // Refresh token value for this refresh token
    userId!: number;            // Primary key of owning user

    // Static Methods --------------------------------------------------------

    static async create
        (oauthRefreshToken: RefreshToken, options?: any)
        : Promise<RefreshToken>
    {
        const original = REFRESH_TOKENS.get(oauthRefreshToken.token);
        if (original) {
            throw new NotUnique(`token: Refresh token '${oauthRefreshToken.token}' is already in use`);
        } else {
            oauthRefreshToken.id = ++REFRESH_TOKEN_ID;
            REFRESH_TOKENS.set(oauthRefreshToken.token, oauthRefreshToken);
            return oauthRefreshToken;
        }
    }

    static async findAll(options?: any): Promise<RefreshToken[]> {
        return Array.from(REFRESH_TOKENS.values());
    }

    static lookup = async (token: string): Promise<RefreshToken | null> => {
        const result = REFRESH_TOKENS.get(token);
        if (result) {
            return result;
        } else {
            return null;
        }
    }

}

export default RefreshToken;

// Private Objects -----------------------------------------------------------

let REFRESH_TOKEN_ID: number = 0;

// Key = refresh token value
const REFRESH_TOKENS: Map<string, RefreshToken> = new Map();

