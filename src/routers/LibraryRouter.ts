// LibraryRouter -------------------------------------------------------------

// Express endpoints for Library models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireAny,
    requireNone,
    requireRegular,
    requireSuperuser,
} from "../oauth/OAuthMiddleware";
import LibraryServices from "../services/LibraryServices";

// Public Objects ------------------------------------------------------------

export const LibraryRouter = Router({
    strict: true,
});

export default LibraryRouter;

// Model-Specific Routes (no libraryId) --------------------------------------

// GET /exact/:name - Find Library by exact name
LibraryRouter.get("/exact/:name",
    requireAny,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.exact(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Libraries
LibraryRouter.get("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.all(
            req.query
        ));
    });

// POST / - Insert a new Library
LibraryRouter.post("/",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.insert(
            req.body
        ));
    });

// DELETE /:libraryId - Remove Library by ID
LibraryRouter.delete("/:libraryId",
    requireSuperuser,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.remove(
            parseInt(req.params.libraryId, 10)
        ));
    });

// GET /:libraryId - Find Library by ID
LibraryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        console.info("Begin LibraryServices.find(" + req.params.libraryId + ")");
        res.send(await LibraryServices.find(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
        console.info("End LibraryServices.find()");
    });

// PUT /:libraryId - Update Library by ID
LibraryRouter.put("/:libraryId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.update(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/authors - Find Authors for this Library
LibraryRouter.get("/:libraryId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authors(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/series - Find Series for this Library
LibraryRouter.get("/:libraryId/series",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.series(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/stories - Find Stories for this Library
LibraryRouter.get("/:libraryId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.stories(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/volumes - Find Volumes for this Library
LibraryRouter.get("/:libraryId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.volumes(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });
