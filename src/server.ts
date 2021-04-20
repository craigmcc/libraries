// server --------------------------------------------------------------------

// Overall Express server for the Libraries Management Application.

// External Modules ----------------------------------------------------------


require("custom-env").env(true);
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";
import {Orchestrator} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import Database from "./models/Database";
import ExpressApplication from "./routers/ExpressApplication";
import OAuthOrchestratorHandlers from "./oauth/OAuthOrchestratorHandlers";
export const OAuthOrchestrator: Orchestrator
    = new Orchestrator(OAuthOrchestratorHandlers);
import logger from "./util/server-logger";

// Configure Models and Associations -----------------------------------------

logger.info({
    context: "Startup",
    msg: "Initialize Sequelize Models",
    dialect: `${Database.getDialect()}`,
});

// Configure and Start Server ------------------------------------------------

const port = process.env.PORT ? parseInt(process.env.PORT) : 8081;
ExpressApplication.listen(port, () => {
    logger.info({
        context: "Startup",
        msg: "Start Server",
        mode: `${process.env.NODE_ENV}`,
        port: `${port}`,
    });
});
