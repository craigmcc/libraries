// async-validators ----------------------------------------------------------

// Custom (to this application) validation methods that must interact with
// the server asynchronously to perform their validations.  In all cases,
// a "true" return indicates that the proposed value is valid, while
// "false" means it is not.  If a field is required, that must be
// validated separately.

// The methods defined here should correspond (in name and parameters) to
// the similar ones in the server side asynch-validators set, because they
// perform the same semantic functions.

// External Modules ----------------------------------------------------------

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import LibraryClient from "../clients/LibraryClient";
import UserClient from "../clients/UserClient";
import Author from "../models/Author";
import Library from "../models/Library";
import User from "../models/User";

// Public Objects ------------------------------------------------------------

export const validateAuthorNameUnique
    = async (author: Author): Promise<boolean> =>
{
    if (author) {
        try {
            const result: Author = await AuthorClient.exact
                (author.library_id, author.first_name, author.last_name);
            return (result.id === author.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateLibraryNameUnique
    = async (library: Library): Promise<boolean> =>
{
    if (library) {
        try {
            const result: Library = await LibraryClient.exact(library.name);
            return (result.id === library.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

export const validateUserUsernameUnique
    = async (user: User): Promise<boolean> =>
{
    if (user) {
        try {
            const result: User = await UserClient.exact(user.username);
            return (result.id === user.id);
        } catch (error) {
            return true; // Definitely unique
        }
    } else {
        return true;
    }
}

