// ApiRouter -----------------------------------------------------------------

// Consolidation of Routers for REST APIs for application models.

// External Modules ----------------------------------------------------------

import {Router} from "express";

// Internal Modules ----------------------------------------------------------

import AuthorRouter from "./AuthorRouter";
import DevModeRouter from "./DevModeRouter";
import LibraryRouter from "./LibraryRouter";
import VolumeRouter from "./VolumeRouter";
import {VOLUMES} from "../models/SortOrder";

// Public Objects ------------------------------------------------------------

export const ApiRouter = Router({
    strict: true,
});

export default ApiRouter;

// Model Specific Routers ----------------------------------------------------

ApiRouter.use("/authors", AuthorRouter);
ApiRouter.use("/devmode", DevModeRouter);
ApiRouter.use("/libraries", LibraryRouter);
ApiRouter.use("/volumes", VolumeRouter);
