// AuthorRouter --------------------------------------------------------------

// Express endpoints for Author models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/oauth-middleware";
import AuthorServices from "../services/AuthorServices";

// Public Objects ------------------------------------------------------------

export const AuthorRouter = Router({
    strict: true,
});

export default AuthorRouter;

// Model-Specific Routes (no authorId) ---------------------------------------

// GET /:libraryId/active - Find active Authors
AuthorRouter.get("/:libraryId/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:firstName/:lastName - Find Author by exact name
AuthorRouter.get("/:libraryId/exact/:firstName/:lastName",
    requireRegular,
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
    requireRegular,
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
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Library
AuthorRouter.post("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:authorId - Remove Author by ID
AuthorRouter.delete("/:libraryId/:authorId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
        ));
    });

// GET /:libraryId/:authorId - Find Author by ID
AuthorRouter.get("/:libraryId/:authorId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:authorId - Update Author by ID
AuthorRouter.put("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/:authorId/stories - Find Stories for this Author
AuthorRouter.get("/:libraryId/:authorId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.stories(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

// GET /:libraryId/:authorId/volumes - Find Volumes for this Author
AuthorRouter.get("/:libraryId/:authorId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await AuthorServices.volumes(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.authorId, 10),
            req.query
        ));
    });

