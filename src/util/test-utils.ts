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
import Volume from "../models/Volume";

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
    const libraries: Library[] = await reloadLibraries(SeedData.LIBRARIES);
    const authorsFirst: Author[] = await reloadAuthors(libraries[0], SeedData.AUTHORS_FIRST_LIBRARY);
    const authorsSecond: Author[] = await reloadAuthors(libraries[1], SeedData.AUTHORS_SECOND_LIBRARY);
    const volumesFirst: Volume[] = await reloadVolumes(libraries[0], SeedData.VOLUMES_FIRST_LIBRARY);
    const volumesSecond: Volume[] = await reloadVolumes(libraries[1], SeedData.VOLUMES_SECOND_LIBRARY);

}

// Private Objects -----------------------------------------------------------

const reloadAuthors
    = async (library: Library, authors: Partial<Author>[]): Promise<Author[]> =>
{
//    console.info(`Reloading Authors for Library: ${JSON.stringify(library)}`);
    authors.forEach(author => {
        author.library_id = library.id;
    });
    let results: Author[] = [];
    try {
        results = await Author.bulkCreate(authors);
    } catch (error) {
        console.info("  Reloading Authors ERROR", error);
        throw error;
    }
//    console.info("Reloading Authors Results:", results);
    return results;
}

const reloadLibraries
    = async (libraries: Partial<Library>[]): Promise<Library[]> =>
{
//    console.info("Reloading Libraries:", libraries);
    let results: Library[] = [];
    try {
        results = await Library.bulkCreate(libraries);
    } catch (error) {
        console.info("  Reloading Libraries ERROR", error);
        throw error;
    }
//    console.info("Reloading Libraries Results:", results);
    return results;
}

const reloadVolumes
    = async (library: Library, volumes: Partial<Volume>[]): Promise<Volume[]> =>
{
//    console.info(`Reloading Volumes for Library: ${JSON.stringify(library)}`);
    volumes.forEach(volume => {
        volume.library_id = library.id;
    });
    let results: Volume[] = [];
    try {
        results = await Volume.bulkCreate(volumes);
    } catch (error) {
        console.info("  Reloading Volumes ERROR", error);
        throw error;
    }
//    console.info("Reloading Volumes Results:", results);
    return results;
}

const removeLibraries = async (libraries: Partial<Library>[]): Promise<void> => {
    const names: string[] = [];
    libraries.forEach(library => {
        // @ts-ignore
        names.push(library.name);
    })
//    console.info("Removing Libraries:", names);
    try {
        await Library.destroy({
            where: {name: {[Op.in]: names}}
        });
    } catch (error) {
        console.info("  Removing Libraries ERROR", error);
        throw error;
    }
//    console.info("Removing Libraries Complete");
}
