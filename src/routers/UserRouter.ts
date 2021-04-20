// UserRouter ----------------------------------------------------------------

// Express endpoints for User models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import UserServices from "../services/UserServices";

// Public Objects ------------------------------------------------------------

export const UserRouter = Router({
    strict: true,
});

export default UserRouter;

// Model-Specific Routes (no userId) -----------------------------------------

// GET /active - Find active Users
UserRouter.get("/active",
    async (req: Request, res: Response) => {
        res.send(await UserServices.active(
            req.query
        ));
    });

// GET /exact/:name - Find User by exact name
UserRouter.get("/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await UserServices.exact(
            req.params.name,
            req.query
        ));
    });

// GET /name/:name - Find Users by name match
UserRouter.get("/name/:name",
    async (req: Request, res: Response) => {
        res.send(await UserServices.name(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Users
UserRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.all(
            req.query
        ));
    });

// POST / - Insert a new User
UserRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await UserServices.insert(
            req.body
        ));
    });

// DELETE /:userId - Remove User by ID
UserRouter.delete("/:userId",
    async (req: Request, res: Response) => {
        res.send(await UserServices.remove(
            parseInt(req.params.userId, 10)
        ));
    });

// GET /:userId - Find User by ID
UserRouter.get("/:userId",
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
    async (req: Request, res: Response) => {
        res.send(await UserServices.update(
            parseInt(req.params.userId, 10),
            req.body
        ));
    });

