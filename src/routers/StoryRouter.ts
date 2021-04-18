// StoryRouter ---------------------------------------------------------------

// Express endpoints for Story models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import StoryServices from "../services/StoryServices";

// Public Objects ------------------------------------------------------------

export const StoryRouter = Router({
    strict: true,
});

export default StoryRouter;

// Model-Specific Routes (no storyId) ---------------------------------------

// GET /:libraryId/active - Find active Stories
StoryRouter.get("/:libraryId/active",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:name - Find Story by exact name
StoryRouter.get("/:libraryId/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// GET /:libraryId/name/:name - Find Stories by name match
StoryRouter.get("/:libraryId/name/:name",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.name(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Stories
StoryRouter.get("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Story
StoryRouter.post("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:storyId - Remove Story by ID
StoryRouter.delete("/:libraryId/:storyId",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
        ));
    });

// GET /:libraryId/:storyId - Find Story by ID
StoryRouter.get("/:libraryId/:storyId",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:storyId - Update Story by ID
StoryRouter.put("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

/*
// GET /:libraryId/:storyId/authors - Find Authors for this Story
StoryRouter.get("/:libraryId/:storyId/authors",
    async (req: Request, res: Response) => {
        res.send(await StoryServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.storyId, 10),
            req.query
        ));
    });
*/
