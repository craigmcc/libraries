// server --------------------------------------------------------------------

// Overall Express server for the Libraries Management Application.

// External Modules ----------------------------------------------------------

require("custom-env").env(true);
export const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : "production";

import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

import pg from "pg";
export const pool =
    new pg.Pool({ connectionString: process.env.DATABASE_URL });
pool.on("error", err => console.error(err));

// Internal Modules ----------------------------------------------------------

// Configure and Start Server ------------------------------------------------

//console.info("db:", db);

// Look up all defined libraries

const lookup = async () => {
    const libraries = await db.select("libraries", db.all).run(pool);
    console.info("type:     ", typeof libraries);
    console.info("libraries:", libraries);
}

lookup();

