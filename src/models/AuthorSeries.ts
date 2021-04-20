// AuthorSeries ---------------------------------------------------------------

// Join table for Authors of Series.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import Series from "./Series";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "authors_series"
})
export class AuthorSeries extends AbstractModel<AuthorSeries> {

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

    @BelongsTo(() => Series)
    volume!: Series;

    @Column({
        allowNull: false,
        field: "series_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Series)
    series_id!: number;

}

export default AuthorSeries;
