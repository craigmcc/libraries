// Database ------------------------------------------------------------------

// Set up database integration and return a configured Sequelize object.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import { Sequelize } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import Library from "./Library";
import Volume from "./Volume";

// Configure Database Instance -----------------------------------------------

const DATABASE_URL: string = process.env.DATABASE_URL
    ? process.env.DATABASE_URL
    : "undefined";
const NODE_ENV = process.env.NODE_ENV;

export const Database = ((NODE_ENV != "test")
    ? new Sequelize(DATABASE_URL, {
            logging: false,
            pool: {
                acquire: 30000,
                idle: 10000,
                max: 5,
                min: 0
            }
        })
    : new Sequelize("database", "username", "password", {
            dialect: "sqlite",
            logging: false,
            storage: "./test/database.sqlite"
        })
);

Database.addModels([
    Author,
    Library,
    Volume,
]);

export default Database;
