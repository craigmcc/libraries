// async-validators ----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const validateAuthorId
    = async (library_id: number, author_id: number | undefined): Promise<boolean> =>
{
    if (author_id) {
        const author = await Author.findByPk(author_id);
        if (!author) {
            return false;
        } else {
            return author.library_id === library_id;
        }
    } else {
        return true;
    }
}

export const validateAuthorNameUnique
    = async (author: Author): Promise<boolean> =>
{
    if (author) {
        let options: any = {
            where: {
                first_name: author.first_name,
                last_name: author.last_name,
                library_id: author.library_id,
            }
        }
        if (author.id) {
            options.where.id = { [Op.ne]: author.id }
        }
        const results: Author[] = await Author.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateLibraryId = async (libraryId: number): Promise<boolean> => {
    if (libraryId) {
        const library = Library.findByPk(libraryId);
        return (library !== null);
    } else {
        return true;
    }
}

export const validateLibraryNameUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options = {};
        if (library.id && (library.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: library.id},
                    name: library.name
                }
            }
        } else {
            options = {
                where: {
                    name: library.name
                }
            }
        }
        let results = await Library.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateLibraryScopeUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        let options = {};
        if (library.id && (library.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: library.id},
                    scope: library.scope
                }
            }
        } else {
            options = {
                where: {
                    scope: library.scope
                }
            }
        }
        let results = await Library.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user) {
        let options = {};
        if (user.id && (user.id > 0)) {
            options = {
                where: {
                    id: {[Op.ne]: user.id},
                    username: user.username
                }
            }
        } else {
            options = {
                where: {
                    username: user.username
                }
            }
        }
        let results = await User.findAll(options);
        return (results.length === 0);
    } else {
        return true;
    }
}

