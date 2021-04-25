// SeriesRouter ---------------------------------------------------------------

// Express endpoints for Series models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/oauth-middleware";
import SeriesServices from "../services/SeriesServices";

// Public Objects ------------------------------------------------------------

export const SeriesRouter = Router({
    strict: true,
});

export default SeriesRouter;

// Model-Specific Routes (no seriesId) ---------------------------------------

// GET /:libraryId/active - Find active Series
SeriesRouter.get("/:libraryId/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:name - Find Series by exact name
SeriesRouter.get("/:libraryId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// GET /:libraryId/name/:name - Find Series by name match
SeriesRouter.get("/:libraryId/name/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.name(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Series
SeriesRouter.get("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Series
SeriesRouter.post("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:seriesId - Remove Series by ID
SeriesRouter.delete("/:libraryId/:seriesId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
        ));
    });

// GET /:libraryId/:seriesId - Find Series by ID
SeriesRouter.get("/:libraryId/:seriesId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:seriesId - Update Series by ID
SeriesRouter.put("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/:seriesId/authors - Find Authors for this Series
SeriesRouter.get("/:libraryId/:seriesId/authors",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });

// GET /:libraryId/:seriesId/stories - Find Stories for this Series
SeriesRouter.get("/:libraryId/:seriesId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await SeriesServices.stories(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.seriesId, 10),
            req.query
        ));
    });
