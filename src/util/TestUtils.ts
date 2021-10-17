// TestUtils -----------------------------------------------------------------

// Generic utility methods for tests.

// External Modules ----------------------------------------------------------

import {PasswordTokenRequest} from "@craigmcc/oauth-orchestrator";

// Internal Modules ----------------------------------------------------------

import * as SeedData from "./SeedData";
import {NotFound} from "./HttpErrors";
import AccessToken from "../models/AccessToken";
import Author from "../models/Author";
import Database from "../models/Database";
import Library from "../models/Library";
import RefreshToken from "../models/RefreshToken";
import Series from "../models/Series";
import Story from "../models/Story";
import Volume from "../models/Volume";
import SeriesStory from "../models/SeriesStory";
import User from "../models/User";
import OAuthOrchestrator from "../oauth/OAuthOrchestrator";
import {hashPassword} from "../oauth/OAuthUtils";

// Public Objects ------------------------------------------------------------

export const authorization = async (username: string): Promise<string> => {
    const user = await lookupUser(username);
    const request: PasswordTokenRequest = {
        grant_type: "password",
        password: user.username, // For tests, we hashed the username as the password
        scope: user.scope,
        username: user.username,
    }
    const response = await OAuthOrchestrator.token(request);
    return `Bearer ${response.access_token}`;
}

export type OPTIONS = {
    withAccessTokens: boolean,
    withAuthors: boolean,
    withLibraries: boolean,
    withRefreshTokens: boolean,
    withSeries: boolean,
    withStories: boolean,
    withUsers: boolean,
    withVolumes: boolean,
}

export const loadTestData = async (options: Partial<OPTIONS> = {}): Promise<void> => {

    // Create tables (if necessary), and erase current contents
    await Database.sync({
        force: true,
    });

    // Load users (and tokens) if requested
    if (options.withUsers) {
        await loadUsers(SeedData.USERS);
        const userSuperuser = await lookupUser(SeedData.USER_USERNAME_SUPERUSER);
        if (options.withAccessTokens) {
            await loadAccessTokens(userSuperuser, SeedData.ACCESS_TOKENS_SUPERUSER);
        }
        if (options.withRefreshTokens) {
            await loadRefreshTokens(userSuperuser, SeedData.REFRESH_TOKENS_SUPERUSER);
        }
    }

    // If libraries are not requested, nothing else will be loaded
    let libraries: Library[] = [];
    if (options.withLibraries) {
        libraries = await loadLibraries(SeedData.LIBRARIES);
    } else {
        return;
    }

    // Storage for detailed data (if loaded)
    let authors0: Author[] = [];
    let authors1: Author[] = [];
    let series0: Series[] = [];
    let series1: Series[] = [];
    let stories0: Story[] = [];
    let stories1: Story[] = [];
    let volumes0: Volume[] = [];
    let volumes1: Volume[] = [];

    // Load top level detailed data as requested
    if (options.withAuthors) {
        authors0 = await loadAuthors(libraries[0], SeedData.AUTHORS_LIBRARY0);
        authors1 = await loadAuthors(libraries[1], SeedData.AUTHORS_LIBRARY1);
    }
    if (options.withSeries) {
        series0 = await loadSeries(libraries[0], SeedData.SERIES_LIBRARY0);
        series1 = await loadSeries(libraries[1], SeedData.SERIES_LIBRARY1);
    }
    if (options.withStories) {
        stories0 = await loadStories(libraries[0], SeedData.STORIES_LIBRARY0);
        stories1 = await loadStories(libraries[1], SeedData.STORIES_LIBRARY1);
    }
    if (options.withVolumes) {
        volumes0 = await loadVolumes(libraries[0], SeedData.VOLUMES_LIBRARY0);
        volumes1 = await loadVolumes(libraries[1], SeedData.VOLUMES_LIBRARY1);
    }

    // Load relationships if both related tables were requested
    if (options.withAuthors && options.withSeries) {
        loadAuthorSeries(authors0[0], [series0[0]]);
        loadAuthorSeries(authors0[1], [series0[0]]);
        loadAuthorSeries(authors1[0], [series1[0]]);
        loadAuthorSeries(authors1[1], [series1[0]]);
    }
    if (options.withAuthors && options.withStories) {
        loadAuthorStories(authors0[0], [stories0[0], stories0[2]]);
        loadAuthorStories(authors0[1], [stories0[1], stories0[2]]);
        loadAuthorStories(authors1[0], [stories1[0], stories1[2]]);
        loadAuthorStories(authors1[1], [stories1[1], stories1[2]]);
    }
    if (options.withAuthors && options.withVolumes) {
        loadAuthorVolumes(authors0[0], [volumes0[0], volumes0[2]]);
        loadAuthorVolumes(authors0[1], [volumes0[1], volumes0[2]]);
        loadAuthorVolumes(authors1[0], [volumes1[0], volumes1[2]]);
        loadAuthorVolumes(authors1[1], [volumes1[1], volumes1[2]]);
    }
    if (options.withSeries && options.withStories) {
        loadSeriesStory(series0[0], stories0[0], 1);
        loadSeriesStory(series0[0], stories0[1], 2);
        loadSeriesStory(series0[0], stories0[2], 3);
        loadSeriesStory(series1[0], stories1[0], 3);
        loadSeriesStory(series1[0], stories1[1], 2);
        loadSeriesStory(series1[0], stories1[2], 1);
    }
    if (options.withVolumes && options.withStories) {
        loadVolumeStories(volumes0[0], [stories0[0]]);
        loadVolumeStories(volumes0[1], [stories0[1]]);
        loadVolumeStories(volumes0[2], [stories0[0], stories0[1], stories0[2]]);
        loadVolumeStories(volumes1[0], [stories1[0]]);
        loadVolumeStories(volumes1[1], [stories1[1]]);
        loadVolumeStories(volumes1[2], [stories1[0], stories1[1], stories1[2]]);
    }

}

export const lookupLibrary = async (name: string): Promise<Library> => {
    const result = await Library.findOne({
        where: { name: name }
    });
    if (result) {
        return result;
    } else {
        throw new NotFound(`name: Should have found Library for '${name}'`);
    }
}

export const lookupUser = async (username: string): Promise<User> => {
    const result = await User.findOne({
        where: { username: username }
    });
    if (result) {
        return result;
    } else {
        throw new NotFound(`username: Should have found User for '${username}'`);
    }
}

// Private Objects -----------------------------------------------------------

const loadAccessTokens
    = async (user: User, accessTokens: Partial<AccessToken>[]): Promise<AccessToken[]> => {
    accessTokens.forEach(accessToken => {
        accessToken.userId = user.id;
    });
    let results: AccessToken[] = [];
    try {
        results = await AccessToken.bulkCreate(accessTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading AccessTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const loadAuthors
    = async (library: Library, authors: Partial<Author>[]): Promise<Author[]> =>
{
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
    return results;
}

const loadAuthorSeries
    = async (author: Author, series: Series[]): Promise<void> =>
{
    await author.$add("series", series);
}

const loadAuthorStories
    = async (author: Author, stories: Story[]): Promise<void> =>
{
    await author.$add("stories", stories);
}

const loadAuthorVolumes
    = async (author: Author, volumes: Volume[]): Promise<void> =>
{
    await author.$add("volumes", volumes);
}

const loadLibraries
    = async (libraries: Partial<Library>[]): Promise<Library[]> =>
{
    let results: Library[] = [];
    try {
        results = await Library.bulkCreate(libraries);
    } catch (error) {
        console.info("  Reloading Libraries ERROR", error);
        throw error;
    }
    return results;
}

const loadSeries
    = async (library: Library, series: Partial<Series>[]): Promise<Series[]> =>
{
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
    return results;
}

const loadSeriesStory
    = async (series: Series, story: Story, ordinal: number): Promise<void> =>
{
    await SeriesStory.create({
        seriesId: series.id,
        storyId: story.id,
        ordinal: ordinal,
    });
}

const loadStories
    = async (library: Library, stories: Partial<Story>[]): Promise<Story[]> =>
{
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
    return results;
}

const loadRefreshTokens
    = async (user: User, refreshTokens: Partial<RefreshToken>[]): Promise<RefreshToken[]> => {
    refreshTokens.forEach(refreshToken => {
        refreshToken.userId = user.id;
    });
    let results: RefreshToken[] = [];
    try {
        results = await RefreshToken.bulkCreate(refreshTokens);
        return results;
    } catch (error) {
        console.info(`  Reloading RefreshTokens for User '${user.username}' ERROR`, error);
        throw error;
    }
}

const hashedPassword = async (password: string | undefined): Promise<string> => {
    return await hashPassword(password ? password : "");
}

const loadUsers = async (users: Partial<User>[]): Promise<User[]> => {
    // For tests, the unhashed password is the same as the username
    const promises = await users.map(user => hashedPassword(user.username));
    const hashedPasswords: string[] = await Promise.all(promises);
    for(let i = 0; i < users.length; i++) {
        users[i].password = hashedPasswords[i];
    }
    try {
        const results = await User.bulkCreate(users);
        return results;
    } catch (error) {
        console.info("  Reloading Users ERROR", error);
        throw error;
    }
}

const loadVolumes
    = async (library: Library, volumes: Partial<Volume>[]): Promise<Volume[]> =>
{
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
    return results;
}

const loadVolumeStories
    = async (volume: Volume, stories: Story[]): Promise<void> =>
{
    await volume.$add("stories", stories);
}
