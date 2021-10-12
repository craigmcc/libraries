// test-utils ----------------------------------------------------------------

// Generic utility methods for tests.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./seed-data";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import SeriesStory from "../models/SeriesStory";
import User from "../models/User";
import {hashPassword} from "../oauth/oauth-utils";
import {NotFound} from "./HttpErrors";

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
    const authors0: Author[] = await reloadAuthors(libraries[0], SeedData.AUTHORS_LIBRARY0);
    const authors1: Author[] = await reloadAuthors(libraries[1], SeedData.AUTHORS_LIBRARY1);
    const series0: Series[] = await reloadSeries(libraries[0], SeedData.SERIES_LIBRARY0);
    const series1: Series[] = await reloadSeries(libraries[1], SeedData.SERIES_LIBRARY1);
    const stories0: Story[] = await reloadStories(libraries[0], SeedData.STORIES_LIBRARY0);
    const stories1: Story[] = await reloadStories(libraries[1], SeedData.STORIES_LIBRARY1);
    const volumes0: Volume[] = await reloadVolumes(libraries[0], SeedData.VOLUMES_LIBRARY0);
    const volumes1: Volume[] = await reloadVolumes(libraries[1], SeedData.VOLUMES_LIBRARY1);
    const user: User = await reloadUser();

    // Establish many-many relationships (requires knowledge of seed data content)

    reloadAuthorSeries(authors0[0], [series0[0]]);
    reloadAuthorSeries(authors0[1], [series0[0]]);
    reloadAuthorSeries(authors1[0], [series1[0]]);
    reloadAuthorSeries(authors1[1], [series1[0]]);

    reloadAuthorStories(authors0[0], [stories0[0], stories0[2]]);
    reloadAuthorStories(authors0[1], [stories0[1], stories0[2]]);
    reloadAuthorStories(authors1[0], [stories1[0], stories1[2]]);
    reloadAuthorStories(authors1[1], [stories1[1], stories1[2]]);

    reloadAuthorVolumes(authors0[0], [volumes0[0], volumes0[2]]);
    reloadAuthorVolumes(authors0[1], [volumes0[1], volumes0[2]]);
    reloadAuthorVolumes(authors1[0], [volumes1[0], volumes1[2]]);
    reloadAuthorVolumes(authors1[1], [volumes1[1], volumes1[2]]);

    reloadSeriesStory(series0[0], stories0[0], 1);
    reloadSeriesStory(series0[0], stories0[1], 2);
    reloadSeriesStory(series0[0], stories0[2], 3);
    reloadSeriesStory(series1[0], stories1[0], 3);
    reloadSeriesStory(series1[0], stories1[1], 2);
    reloadSeriesStory(series1[0], stories1[2], 1);

    reloadVolumeStories(volumes0[0], [stories0[0]]);
    reloadVolumeStories(volumes0[1], [stories0[1]]);
    reloadVolumeStories(volumes0[2], [stories0[0], stories0[1], stories0[2]]);
    reloadVolumeStories(volumes1[0], [stories1[0]]);
    reloadVolumeStories(volumes1[1], [stories1[1]]);
    reloadVolumeStories(volumes1[2], [stories1[0], stories1[1], stories1[2]]);

}

// Private Objects -----------------------------------------------------------

const reloadAuthors
    = async (library: Library, authors: Partial<Author>[]): Promise<Author[]> =>
{
//    console.info(`Reloading Authors for Library: ${JSON.stringify(library)}`);
    authors.forEach(author => {
        author.libraryId = library.id;
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

const reloadAuthorSeries
    = async (author: Author, series: Series[]): Promise<void> =>
{
    await author.$add("series", series);
}

const reloadAuthorStories
    = async (author: Author, stories: Story[]): Promise<void> =>
{
    await author.$add("stories", stories);
}

const reloadAuthorVolumes
    = async (author: Author, volumes: Volume[]): Promise<void> =>
{
    await author.$add("volumes", volumes);
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

const reloadSeries
    = async (library: Library, series: Partial<Series>[]): Promise<Series[]> =>
{
//    console.info(`Reloading Series for Library: ${JSON.stringify(library)}`);
    series.forEach(aSeries => {
        aSeries.libraryId = library.id;
    });
    let results: Series[] = [];
    try {
        results = await Series.bulkCreate(series);
    } catch (error) {
        console.info("  Reloading Series ERROR", error);
        throw error;
    }
//    console.info("Reloading Series Results:", results);
    return results;
}

const reloadSeriesStory
    = async (series: Series, story: Story, ordinal: number): Promise<void> =>
{
    await SeriesStory.create({
        series_id: series.id,
        story_id: story.id,
        ordinal: ordinal,
    });
}

const reloadStories
    = async (library: Library, stories: Partial<Story>[]): Promise<Story[]> =>
{
//    console.info(`Reloading Stories for Library: ${JSON.stringify(library)}`);
    stories.forEach(story => {
        story.libraryId = library.id;
    });
    let results: Story[] = [];
    try {
        results = await Story.bulkCreate(stories);
    } catch (error) {
        console.info("  Reloading Stories ERROR", error);
        throw error;
    }
//    console.info("Reloading Stories Results:", results);
    return results;
}

const reloadUser = async (): Promise<User> => {
    const found = await User.findOne({
        where: { username: "superuser" }
    });
    if (found) {
        return found;
    }
    const SUPERUSER_PASSWORD = process.env.SUPERUSER_PASSWORD
        ? process.env.SUPERUSER_PASSWORD
        : "superuser";
    const user: Partial<User> = {
        active: true,
        password: await hashPassword(SUPERUSER_PASSWORD),
        scope: "superuser",
        username: "superuser",
    }
    return await User.create(user);
}

const reloadVolumes
    = async (library: Library, volumes: Partial<Volume>[]): Promise<Volume[]> =>
{
//    console.info(`Reloading Volumes for Library: ${JSON.stringify(library)}`);
    volumes.forEach(volume => {
        volume.libraryId = library.id;
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

const reloadVolumeStories
    = async (volume: Volume, stories: Story[]): Promise<void> =>
{
    await volume.$add("stories", stories);
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
