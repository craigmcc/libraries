// SeriesStory ---------------------------------------------------------------

// Join table for Series containing Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Series from "./Series";
import Story from "./Story";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "series_stories"
})
export class SeriesStory extends AbstractModel<SeriesStory> {

    @Column({
        allowNull: true,
        field: "ordinal",
        type: DataType.SMALLINT
    })
    ordinal!: number;

    @BelongsTo(() => Series)
    series!: Series;

    @Column({
        allowNull: false,
        field: "series_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Series)
    series_id!: number;

    @BelongsTo(() => Story)
    story!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    story_id!: number;

}

export default SeriesStory;
