// OpenApiRouter -------------------------------------------------------------

// Express endpoint to generate an openapi.json response describing the REST
// APIs supported by this application.

// External Modules ----------------------------------------------------------

import {Request, Response, Router} from "express";
import {OpenApiBuilder} from "openapi3-ts";

// Public Objects ------------------------------------------------------------

export const OpenApiRouter = Router({
    strict: true,
});

export default OpenApiRouter;

// Open API Routes ----------------------------------------------------------

OpenApiRouter.get("/", (req: Request, res: Response) => {
    res.header("Content-Type", "application/json")
       .send(openApiDocument());
})

// Private Methods ---------------------------------------------------------

const openApiDocument = (): string => {

    const builder = OpenApiBuilder.create()
        .addContact({name: "Craig McClanahan", email: "craigmcc@gmail.com"})
        .addLicense({name: "Apache-2.0"})
        .addOpenApiVersion("3.0.0") // swagger-ui does not support 3.1.0 yet
        .addTitle("Library Management Application");

    // UserRouter
/*
    builder.addPath("/api/users/active", {
        get: {
            responses: {
                default: {
                    $ref: "",
                }
            }
        }
    })
*/

    return builder.getSpecAsJson(replacer, 2);

}

const replacer = (key: string, value: any) => {
    return value;
}
