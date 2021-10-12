// ServerLogger --------------------------------------------------------------

// Configure and return a Pino logger for server generated messages.

// External Modules ----------------------------------------------------------

import rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import {nowLocalISO} from "./Timestamps";

// Public Objects -----------------------------------------------------------

const NODE_ENV = process.env.NODE_ENV;
const SERVER_LOG = process.env.SERVER_LOG ? process.env.SERVER_LOG : "stderr";

const logger = (SERVER_LOG === "stderr") || (SERVER_LOG === "stdout")
    ? require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "info" : "debug",
        timestamp: function (): string {
            return ',"time":"' + nowLocalISO() + '"';
        }
    }, (SERVER_LOG === "stderr") ? process.stderr : process.stdout)
    : require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "info" : "debug",
        timestamp: function (): string {
            return ',"time":"' + nowLocalISO() + '"';
        }
    }, rfs.createStream(SERVER_LOG, {
        interval: "1d",
        path: "log",
    }));

export default logger;
