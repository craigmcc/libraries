// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, BelongsToMany, Column, DataType, ForeignKey, HasMany, Index, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import AuthorVolume from "./AuthorVolume";
import Library from "./Library";
import Story from "./Story";
import VolumeStory from "./VolumeStory";
import {validateLocation, validateVolumeType} from "../util/application-validators";
import {validateLibraryId} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "volumes",
    validate: {
        isLibraryIdValid: async function(this: Volume): Promise<void> {
            if (!(await validateLibraryId(this.library_id))) {
                throw new BadRequest
                (`library_id: Invalid library_id ${this.library_id}`);
            }
        },
        isValidLocation: function(this: Volume): void {
            if (!validateLocation(this.location)) {
                throw new BadRequest(`location: Invalid location '${this.location}'`);
            }
        },
        isValidVolumeType: function(this: Volume): void {
            if (!validateVolumeType(this.type)) {
                throw new BadRequest(`type: Invalid volume type '${this.type}'`);
            }
        }
    },
})
export class Volume extends AbstractModel<Volume> {

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

    @BelongsToMany(() => Author, () => AuthorVolume)
    authors!: Array<Author & {AuthorVolume: AuthorVolume}>;

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    copyright?: string;

    @Column({
        allowNull: true,
        field: "google_id",
        type: DataType.STRING,
    })
    google_id?: string;

    @Column({
        allowNull: true,
        field: "isbn",
        type: DataType.STRING
    })
    isbn?: string;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Index("ix_volumes_library_id_name")
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "library_id: Is required"
            }
        },
    })
    library_id!: number;

    @Column({
        allowNull: true,
        field: "location",
        type: DataType.STRING,
    })
    location?: string;

    @Index("ix_volumes_library_id_name")
    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
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
        defaultValue: false,
        field: "read",
        type: DataType.BOOLEAN,
        validate: {
            notNull: {
                msg: "read: Is required"
            }
        }
    })
    read!: boolean;

    @BelongsToMany(() => Story, () => VolumeStory)
    stories!: Array<Story & {VolumeStory: VolumeStory}>;

    @Column({
        allowNull: false,
        defaultValue: "Single",
        field: "type",
        type: DataType.STRING,
    })
    type!: string;

}

export default Volume;
