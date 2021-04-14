// ExpressApplication --------------------------------------------------------

// Overall Express application, configured as a Javascript class.

// External Modules ----------------------------------------------------------

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";
import path from "path";

// Internal Modules ----------------------------------------------------------

import ApiRouter from "./ApiRouter";
import {
    handleHttpError,
    handleServerError,
    handleValidationError
} from "../util/middleware";
import logger from "../util/server-logger";

// Public Objects ------------------------------------------------------------

const app = express();

// Configure global middleware
app.use(cors({
    origin: "*"
}));
app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));

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
app.use("/api", ApiRouter);

// Configure error handling (must be last)
app.use(handleHttpError);
app.use(handleValidationError);
app.use(handleServerError); // The last of the last :-)

// Configure unknown mappings back to client
app.get("*", (req, res) => {
    res.sendFile(CLIENT_BASE + "/index.html");
})

export default app;
