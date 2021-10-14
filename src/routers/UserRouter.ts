// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {requireSuperuser} from "../oauth/OAuthMiddleware";
import UserServices from "../services/UserServices";

// Public Objects ------------------------------------------------------------

export const UserRouter = Router({
    strict: true,
});

export default UserRouter;

// Model-Specific Routes (no userId) -----------------------------------------

// GET /exact/:name - Find User by exact name
UserRouter.get("/exact/:name",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Users
UserRouter.get("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

// POST / - Insert a new User
UserRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove User by ID
UserRouter.delete("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(
            parseInt(req.params.userId, 10)
        ));
    });

// GET /:userId - Find User by ID
UserRouter.get("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        console.info("Begin UserServices.find(" + req.params.userId + ")");
        res.send(await UserServices.find(
            parseInt(req.params.userId, 10),
            req.query
        ));
        console.info("End UserServices.find()");
    });

// PUT /:userId - Update User by ID
UserRouter.put("/:userId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

