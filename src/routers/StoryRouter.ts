// StoryRouter ---------------------------------------------------------------

// Express endpoints for Story models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/OAuthMiddleware";
import StoryServices from "../services/StoryServices";

// Public Objects ------------------------------------------------------------

export const StoryRouter = Router({
    strict: true,
});

export default StoryRouter;

// Model-Specific Routes (no storyId) ---------------------------------------

// GET /:libraryId/exact/:name - Find Story by exact name
StoryRouter.get("/:libraryId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Stories
StoryRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Story
StoryRouter.post("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:storyId - Remove Story by ID
StoryRouter.delete("/:libraryId/:storyId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
        ));
    });

// GET /:libraryId/:storyId - Find Story by ID
StoryRouter.get("/:libraryId/:storyId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:storyId - Update Story by ID
StoryRouter.put("/:libraryId/:storyId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/:storyId/authors - Find Authors for this Story
StoryRouter.get("/:libraryId/:storyId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });

// GET /:libraryId/:storyId/series - Find Series for this Story
StoryRouter.get("/:libraryId/:storyId/series",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.series(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });

// GET /:libraryId/:storyId/volumes - Find Volumes for this Story
StoryRouter.get("/:libraryId/:storyId/volumes",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await StoryServices.volumes(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });

