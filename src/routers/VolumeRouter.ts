// VolumeRouter --------------------------------------------------------------

// Express endpoints for Volume models.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";

// Internal Modules ----------------------------------------------------------

import {
    requireAdmin,
    requireRegular,
} from "../oauth/oauth-middleware";
import VolumeServices from "../services/VolumeServices";

// Public Objects ------------------------------------------------------------

export const VolumeRouter = Router({
    strict: true,
});

export default VolumeRouter;

// Model-Specific Routes (no volumeId) ---------------------------------------

// GET /:libraryId/active - Find active Volumes
VolumeRouter.get("/:libraryId/active",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.active(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// GET /:libraryId/exact/:name - Find Volume by exact name
VolumeRouter.get("/:libraryId/exact/:name",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.exact(
            parseInt(req.params.libraryId, 10),
            req.params.name,
            req.query
        ));
    });

// GET /:libraryId/name/:name - Find Volumes by name match
VolumeRouter.get("/:libraryId/name/:name",
    requireRegular,
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
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.all(
            parseInt(req.params.libraryId, 10),
            req.query
        ));
    });

// POST /:libraryId/ - Insert a new Volume
VolumeRouter.post("/:libraryId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.insert(
            parseInt(req.params.libraryId, 10),
            req.body
        ));
    });

// DELETE /:libraryId/:volumeId - Remove Volume by ID
VolumeRouter.delete("/:libraryId/:volumeId",
    requireAdmin,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.remove(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
        ));
    });

// GET /:libraryId/:volumeId - Find Volume by ID
VolumeRouter.get("/:libraryId/:volumeId",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.find(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.query
        ));
    });

// PUT /:libraryId/:volumeId - Update Volume by ID
VolumeRouter.put("/:libraryId",
    requireRegular,
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
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.authors(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.query
        ));
    });

// GET /:libraryId/:volumeId/stories - Find Stories for this Volume
VolumeRouter.get("/:libraryId/:volumeId/stories",
    requireRegular,
    async (req: Request, res: Response) => {
        res.send(await VolumeServices.stories(
            parseInt(req.params.libraryId, 10),
            parseInt(req.params.volumeId, 10),
            req.query
        ));
    });
