// LibrariesServices ---------------------------------------------------------

// Services implementations for "libraries" table.

// External Modules ----------------------------------------------------------

import * as db from "zapatos/db";
import type * as s from "zapatos/schema";

// Internal Modules ----------------------------------------------------------

import { pool } from "../server";
import {
    LIBRARIES_ORDER_BY,
    LIBRARIES_TABLE
} from "../util/constants";

// Public Objects ------------------------------------------------------------

class LibraryServices {

    public async all(query?: any): Promise<s.libraries.Selectable[]> {
        const options: any = {
            order: LIBRARIES_ORDER_BY
        }
        if (query.limit) {
            options.limit = query.limit;
        }
        if (query.offset) {
            options.offset = query.offset;
        }
        const results: s.libraries.Selectable[]
            = await db.select(LIBRARIES_TABLE, db.all, options).run(pool);
        return results;
    }

}

export default new LibraryServices();
