// OpenApiRouter -------------------------------------------------------------

// Express endpoint to generate an openapi.json response describing the REST
// APIs supported by this application.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";
import {generateOpenApi} from "../services/OpenApiServices";

// Public Objects ------------------------------------------------------------

export const OpenApiRouter = Router({
    strict: true,
});

export default OpenApiRouter;

// Open API Routes ----------------------------------------------------------

OpenApiRouter.get("/", (req: Request, res: Response) => {
    res.header("Content-Type", "application/json")
       .send(generateOpenApi());
})

