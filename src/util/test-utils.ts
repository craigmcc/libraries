// test-utils ----------------------------------------------------------------

// Generic utility methods for tests.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import {NotFound} from "./http-errors";
import * as SeedData from "./seed-data";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";

// Public Objects ------------------------------------------------------------

export const findLibraryByName = async (name: string): Promise<Library> => {
    const result = await Library.findOne({
        where: { name: name },
    });
    if (result) {
        return result;
    } else {
        throw new NotFound(`name: Should have found Library '${name}'`);
    }
}

export const reloadTestData = async (): Promise<void> => {

    // Synchronize database to create tables if needed
    await Database.sync();

    // Remove any existing test libraries (which should cascade)
    SeedData.LIBRARIES.forEach(async library => {
        try {
            if (library.name) {
                const found = await findLibraryByName(library.name);
                await Library.destroy({
                    where: { id: found.id }
                });
            }
        } catch (error) {
            if (!(error instanceof NotFound)) {
                throw error;
            }
        }
    });

    // Recreate the test libraries, saving their information
    const libraries: Library[] = [];
    SeedData.LIBRARIES.forEach(async library => {
        libraries.push(await Library.create(library));
    });

    // Recreate authors for first library
    const authorsFirst: Author[] = [];
    SeedData.AUTHORS_FIRST_LIBRARY.forEach(async author => {
        author.library_id = libraries[0].id;
        authorsFirst.push(await Author.create(author));

    });

    // Recreate authors for second library
    const authorsSecond: Author[] = [];
    SeedData.AUTHORS_SECOND_LIBRARY.forEach(async author => {
        author.library_id = libraries[1].id;
        authorsSecond.push(await Author.create(author));
    });

    // TODO - Recreate associated subordinate data

}
