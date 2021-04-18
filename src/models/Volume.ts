// Volume --------------------------------------------------------------------

// Physical or electronic published unit, written by one or more Authors,
// and containing one or more Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, HasMany, Index, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Library from "./Library";
import {
    validateLibraryId
} from "../util/async-validators";
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

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    copyright?: string;

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
        type: DataType.STRING
    })
    location?: string;

    @Column({
        allowNull: true,
        field: "media",
        type: DataType.STRING
    })
    media?: string;

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

}

export default Volume;
