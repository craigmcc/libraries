// AuthorRouter --------------------------------------------------------------

// Express endpoints for Author models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import AuthorServices from "../services/AuthorServices";

// Public Objects ------------------------------------------------------------

export const AuthorRouter = Router({
    strict: true,
});

export default AuthorRouter;

// Model-Specific Routes (no authorId) ---------------------------------------

// GET /:libraryId/active - Find active Authors
AuthorRouter.get("/:libraryId/active",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:firstName/:lastName - Find Author by exact name
AuthorRouter.get("/:libraryId/exact/:firstName/:lastName",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.firstName,
            req.params.lastName,
            req.query
        ));
    });

// GET /:libraryId/name/:name - Find Authors by name match
AuthorRouter.get("/:libraryId/name/:name",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.name(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Authors
AuthorRouter.get("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Library
AuthorRouter.post("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:authorId - Remove Author by ID
AuthorRouter.delete("/:libraryId/:authorId",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
        ));
    });

// GET /:libraryId/:authorId - Find Author by ID
AuthorRouter.get("/:libraryId/:authorId",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:authorId - Update Author by ID
AuthorRouter.put("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/:authorId/volumes - Find Volumes for this Author
AuthorRouter.get("/:libraryId/:authorId/volumes",
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.volumes(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });
