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

    // Reload test data in top-down order
    await removeLibraries(SeedData.LIBRARIES);
    const leftovers: Library[] = await Library.findAll();
    console.info("LEFTOVER LIBRARIES: ", leftovers.length);
    const libraries: Library[] = await reloadLibraries(SeedData.LIBRARIES);
    console.info("RELOADED LIBRARIES: ", libraries);
/*
    const authorsFirst: Author[] = await reloadAuthors(libraries[0], SeedData.AUTHORS_FIRST_LIBRARY);
    const authorsSecond: Author[] = await reloadAuthors(libraries[1], SeedData.AUTHORS_SECOND_LIBRARY);
*/

}

// Private Objects -----------------------------------------------------------

const reloadAuthors
    = async (library: Library, authors: Partial<Author>[]): Promise<Author[]> =>
{
    console.info(`Reloading Authors for Library: ${JSON.stringify(library)}`);
    const results: Author[] = [];
    authors.forEach(async author => {
        try {
            author.library_id = library.id;
            console.info(`  Reloading author: ${JSON.stringify(author)}`);
            const inserted = await Author.create(author);
            console.info(`  Reloaded author:  ${JSON.stringify(inserted)}`);
            results.push(inserted);
        } catch (error) {
            console.info("    Reloading Author ERROR", error);
            throw error;
        }
    });
    console.info("Reloaded Authors for Library: ", results);
    return results;
}

const reloadLibraries
    = async (libraries: Partial<Library>[]): Promise<Library[]> =>
{
    console.info("Reloading Libraries: start");
    const results: Library[] = [];
    libraries.forEach(async library => {
        try {
            console.info(`  Reloading Library: ${JSON.stringify(library)}`);
            const inserted = await Library.create(library);
            console.info(`  Reloaded Library:  ${JSON.stringify(inserted)}`);
            results.push(inserted);
        } catch (error ) {
            console.info("    Reloading Library ERROR", error);
            throw error;
        }
    });
    console.info("Reloading Libraries: results: ", results);
    return results;
}

const removeLibraries = async (libraries: Partial<Library>[]): Promise<void> => {
    console.info("Removing Libraries");
    libraries.forEach(async library => {
        try {
            console.info(`  Removing Library '${library.name}'`);
            await Library.destroy({
                where: {name: library.name}
            })
        } catch (error) {
            console.info("    Removing Library ERROR ", error);
            throw error;
        }
    });
}
