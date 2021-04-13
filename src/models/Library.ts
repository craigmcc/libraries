// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import { Column, DataType, HasMany, Table } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import {
    validateLibraryNameUnique,
    validateLibraryScopeUnique
} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "libraries",
    validate: {
        isLibraryNameUnique: async function(this: Library): Promise<void> {
            if (!(await validateLibraryNameUnique(this))) {
                throw new BadRequest
                (`name: Name '${this.name}' is already in use`);
            }
        },
        isLibraryScopeUnique: async function(this: Library): Promise<void> {
            if (!(await validateLibraryScopeUnique(this))) {
                throw new BadRequest
                (`scope: Scope '${this.scope}' is already in use`);
            }
        },
    }
})
export class Library extends AbstractModel<Library> {

    @Column({
        allowNull: false,
        defaultValue: true,
        field: "active",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "active: Is required"
            }
        }
    })
    active!: boolean;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        unique: "uniqueLibraryName",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
        }
    })
    name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    notes?: string;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "scope: Is required"
            },
        }
    })
    scope!: string;

}

export default Library;
