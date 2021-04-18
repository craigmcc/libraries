// LibraryRouter -------------------------------------------------------------

// Express endpoints for Library models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import LibraryServices from "../services/LibraryServices";

// Public Objects ------------------------------------------------------------

export const LibraryRouter = Router({
    strict: true,
});

export default LibraryRouter;

// Model-Specific Routes (no libraryId) --------------------------------------

// GET /active - Find active Libraries
LibraryRouter.get("/active",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.active(
            req.query
        ));
    });

// GET /exact/:name - Find Library by exact name
LibraryRouter.get("/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.exact(
            req.params.name,
            req.query
        ));
    });

// GET /name/:name - Find Libraries by name match
LibraryRouter.get("/name/:name",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.name(
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET / - Find all Libraries
LibraryRouter.get("/",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.all(
            req.query
        ));
    });

// POST / - Insert a new Library
LibraryRouter.post("/",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.insert(
            req.body
        ));
    });

// DELETE /:libraryId - Remove Library by ID
LibraryRouter.delete("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.remove(
            parseInt(req.params.libraryId, 10)
        ));
    });

// GET /:libraryId - Find Library by ID
LibraryRouter.get("/:libraryId",
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
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.update(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/authors - Find Authors for this Library
LibraryRouter.get("/:libraryId/authors",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.authors(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/stories - Find Stories for this Library
LibraryRouter.get("/:libraryId/stories",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.stories(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/volumes - Find Volumes for this Library
LibraryRouter.get("/:libraryId/volumes",
    async (req: Request, res: Response) => {
        res.send(await LibraryServices.volumes(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

