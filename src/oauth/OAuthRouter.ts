// OAuthRouter ---------------------------------------------------------------

// Consolidation of Routers for OAuth related authentication and authorization.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import OAuthTokenRouter from "./OAuthTokenRouter";

// Public Classes ------------------------------------------------------------

export const OAuthRouter = Router({
    strict: true,
})

// Subordinate Routers -------------------------------------------------------

OAuthRouter.use("/token", OAuthTokenRouter);

export default OAuthRouter;
