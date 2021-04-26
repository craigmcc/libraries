// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import {Column, DataType, HasMany, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import Series from "./Series";
import Story from "./Story";
import Volume from "./Volume";
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

    @HasMany(() => Author, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    authors!: Author[];

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

    @HasMany(() => Series, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    series!: Series[];

    @HasMany(() => Story, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    stories!: Story[];

    @HasMany(() => Volume, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    volumes!: Volume[];

}

export default Library;
