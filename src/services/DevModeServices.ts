// DevModeServices -----------------------------------------------------------

// Services for development only.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from"../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import logger from "../util/server-logger";
import {reloadTestData} from "../util/TestUtils";

// Public Objects ------------------------------------------------------------

export class DevModeServices {

    // Public Methods --------------------------------------------------------

    // Returns array of test Library instances with nested children
    public async reloadTestData(): Promise<Library[]> {
/*
        logger.info({
            context: "DevModeServices.reloadTestData",
            msg: "Reloading started"
        });
*/
        await reloadTestData();
/*
        logger.info({
            context: "DevModeServices.reloadTestData",
            msg: "Reloading ended"
        });
*/
        const results = await Library.findAll({
            include: [
                Author,
                Series,
                Story,
                Volume,
            ],
            where: {
                name: {[Op.ne]: "Personal Library"}
            }
        });
/*
        logger.info({
            context: "DevModeServices.reloadTestData",
            msg: "Reloading returning",
            results: results
        });
*/
        return results;
    }

}

export default new DevModeServices();
