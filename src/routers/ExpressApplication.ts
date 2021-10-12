// ExpressApplication --------------------------------------------------------

// Overall Express application, configured as a Javascript class.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";
const rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import ApiRouter from "./ApiRouter";
import {handleOAuthError} from "../oauth/oauth-middleware";
import OAuthRouter from "../oauth/OAuthRouter";
import {
    handleHttpError,
    handleServerError,
    handleValidationError
} from "../util/Middleware";
import logger from "../util/server-logger";
import { toLocalISO } from "../util/timestamps";
import OpenApiRouter from "./OpenApiRouter";

// Public Objects ------------------------------------------------------------

const app = express();

// Configure global middleware
app.use(cors({
    origin: "*"
}));

// Configure access log management
morgan.token("timestamp",(req, res): string => {
    return toLocalISO(new Date());
})
app.use(morgan("combined", {
    skip: function (req, res) {
        return req.path === "/clientLog";
    }
}));

// Configure body handling middleware
app.use(bodyParser.json({
}));
app.use(bodyParser.text({
    limit: "2mb",
    type: "text/csv",
}));
app.use(bodyParser.urlencoded({
    extended: true,
}));

// Configure static file routing
const CLIENT_BASE: string = path.resolve("./") + "/client/build";
logger.info({
    context: "Startup",
    msg: "Static File Path",
    path: CLIENT_BASE
});
app.use(express.static(CLIENT_BASE));

// Configure application-specific routing
app.use("/openapi.json", OpenApiRouter);
app.use("/api", ApiRouter);
app.use("/oauth", OAuthRouter);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
app.use(handleOAuthError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
})

export default app;
