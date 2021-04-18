// Author --------------------------------------------------------------------

// Contributor to one or more series, stories, and/or volumes.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Table,
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Volume from "./Volume";
import {
    validateAuthorNameUnique,
    validateLibraryId
} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors",
    validate: {
        isLibraryIdValid: async function(this: Author): Promise<void> {
            if (!(await validateLibraryId(this.library_id))) {
                throw new BadRequest
                    (`library_id: Invalid library_id ${this.library_id}`);
            }
        },
        isAuthorNameUnique: async function(this: Author): Promise<void> {
            if (!(await validateAuthorNameUnique(this))) {
                throw new BadRequest
                  (`name: Name '${this.first_name} ${this.last_name}' "
                    + "is already in use within this Library`);
            }
        },
    },
})
export class Author extends AbstractModel<Author> {

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

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "library_id: Is required"
            }
        },
    })
    library_id!: number;

    @Column({
        allowNull: false,
        field: "last_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "last_name: Is required"
            },
        }
    })
    last_name!: string;

    @Column({
        allowNull: false,
        field: "first_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "first_name: Is required"
            },
        }
    })
    first_name!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    notes?: string;

    @BelongsToMany(() => Volume, () => AuthorVolume)
    volumes!: Array<Volume & {AuthorVolume: AuthorVolume}>;

}

export default Author;
