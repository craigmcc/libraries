// AuthorVolume --------------------------------------------------------------

// Join table for authors of volumes.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import Volume from "./Volume";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "authors_volumes"
})
export class AuthorVolume extends AbstractModel<AuthorVolume> {

    @BelongsTo(() => Author)
    author!: Author;

    @Column({
        allowNull: false,
        field: "author_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Author)
    author_id!: number;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "principal",
        type: DataType.BOOLEAN,
    })
    principal!: boolean;

    @BelongsTo(() => Volume)
    volume!: Volume;

    @Column({
        allowNull: false,
        field: "volume_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Volume)
    volume_id!: number;

}

export default AuthorVolume;
