// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import AuthorRouter from "./AuthorRouter";
import LibraryRouter from "./LibraryRouter";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ----------------------------------------------------

ApiRouter.use("/authors", AuthorRouter);
ApiRouter.use("/libraries", LibraryRouter);
