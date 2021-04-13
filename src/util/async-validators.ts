// async-validators ----------------------------------------------------------

// Custom (to this application) validation methods that can only be used by
// server side applications, because they interact directly with the database.
// while "false" means it is not.  If a field is required, that must be
// validated separately.

// External Modules ----------------------------------------------------------

import {Op} from "sequelize";

// Internal Modules ----------------------------------------------------------

import Library from "../models/Library";

// Public Objects ------------------------------------------------------------

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

