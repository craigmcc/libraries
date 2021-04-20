// DevModeRouter -------------------------------------------------------------

// Express endpoints for manipulating test data in production database.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireNotProduction, requireSuperuser} from "../oauth/oauth-middleware";
import DevModeServices from "../services/DevModeServices";

// Public Objects ------------------------------------------------------------

export const DevModeRouter = Router({
    strict: true,
});

export default DevModeRouter;

// Development Mode Routes ---------------------------------------------------

// POST /reload - Reload test seed data
DevModeRouter.post("/reload",
    requireNotProduction,
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await DevModeServices.reloadTestData());
    });

