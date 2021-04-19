// Database ------------------------------------------------------------------

// Set up database integration and return a configured Sequelize object.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
import {Sequelize} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import Author from "./Author";
import AuthorStory from "./AuthorStory";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
import VolumeStory from "./VolumeStory";

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
    AuthorStory,
    AuthorVolume,
    Library,
    Series,
    Story,
    Volume,
    VolumeStory,
]);

export default Database;
