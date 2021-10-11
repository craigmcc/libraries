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
import AuthorStory from "./AuthorStory";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Volume from "./Volume";
import {
    validateAuthorNameUnique,
    validateLibraryId
} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";
import Story from "./Story";
import Series from "./Series";
import AuthorSeries from "./AuthorSeries";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "authors",
    validate: {
        isLibraryIdValid: async function(this: Author): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Invalid libraryId ${this.libraryId}`);
            }
        },
        isAuthorNameUnique: async function(this: Author): Promise<void> {
            if (!(await validateAuthorNameUnique(this))) {
                throw new BadRequest
                  (`name: Name '${this.firstName} ${this.lastName}' "
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
                msg: "libraryId: Is required"
            }
        },
    })
    libraryId!: number;

    @Column({
        allowNull: false,
        field: "last_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "lastName: Is required"
            },
        }
    })
    lastName!: string;

    @Column({
        allowNull: false,
        field: "first_name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "firstName: Is required"
            },
        }
    })
    firstName!: string;

    @Column({
        allowNull: true,
        field: "notes",
        type: DataType.STRING
    })
    notes?: string;

    @BelongsToMany(() => Series, () => AuthorSeries)
    series!: Array<Series & {AuthorSeries: AuthorSeries}>;

    @BelongsToMany(() => Story, () => AuthorStory)
    stories!: Array<Story & {AuthorStory: AuthorStory}>;

    @BelongsToMany(() => Volume, () => AuthorVolume)
    volumes!: Array<Volume & {AuthorVolume: AuthorVolume}>;

}

export default Author;
