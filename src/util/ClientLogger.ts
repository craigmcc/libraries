// ClientLogger --------------------------------------------------------------

// Configure and return a Pino logger for log objects forwarded from clients.

// External Modules ----------------------------------------------------------

import rfs = require("rotating-file-stream");

// Internal Modules ----------------------------------------------------------

import {nowLocalISO} from "./Timestamps";

// Public Objects ------------------------------------------------------------

const NODE_ENV = process.env.NODE_ENV;
const CLIENT_LOG = process.env.CLIENT_LOG ? process.env.CLIENT_LOG : "stderr";

const logger = (CLIENT_LOG === "stderr") || (CLIENT_LOG === "stdout")
    ? require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "info" : "debug",
        timestamp: function (): string {
            return ',"time":"' + nowLocalISO() + '"';
        }
    }, (CLIENT_LOG === "stderr") ? process.stderr : process.stdout)
    : require("pino")({
        base: null, // Remove "hostname", "name", and "pid"
        level: (NODE_ENV === "production") ? "info" : "debug",
        timestamp: function (): string {
            return ',"time":"' + nowLocalISO() + '"';
        }
    }, rfs.createStream(CLIENT_LOG, {
        interval: "1d",
        path: "log",
    }));

export default logger;
