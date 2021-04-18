// VolumeRouter --------------------------------------------------------------

// Express endpoints for Volume models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import VolumeServices from "../services/VolumeServices";
import AuthorServices from "../services/AuthorServices";
import AuthorRouter from "./AuthorRouter";

// Public Objects ------------------------------------------------------------

export const VolumeRouter = Router({
    strict: true,
});

export default VolumeRouter;

// Model-Specific Routes (no volumeId) ---------------------------------------

// GET /:libraryId/active - Find active Volumes
VolumeRouter.get("/:libraryId/active",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:name - Find Volume by exact name
VolumeRouter.get("/:libraryId/exact/:name",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// GET /:libraryId/name/:name - Find Volumes by name match
VolumeRouter.get("/:libraryId/name/:name",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.name(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// Standard CRUD Routes ------------------------------------------------------

// GET /:libraryId - Find all Volumes
VolumeRouter.get("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Volume
VolumeRouter.post("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:volumeId - Remove Volume by ID
VolumeRouter.delete("/:libraryId/:volumeId",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
        ));
    });

// GET /:libraryId/:volumeId - Find Volume by ID
VolumeRouter.get("/:libraryId/:volumeId",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:volumeId - Update Volume by ID
VolumeRouter.put("/:libraryId",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.update(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.body
        ));
    });

// Child Lookup Routes -------------------------------------------------------

// GET /:libraryId/:volumeId/authors - Find Authors for this Volume
VolumeRouter.get("/:libraryId/:volumeId/authors",
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.query
        ));
    });
