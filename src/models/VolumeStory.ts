// VolumeStory ---------------------------------------------------------------

// Join table for Volumes containing Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Story from "./Story";
import Volume from "./Volume";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "volumes_stories"
})
export class VolumeStory extends AbstractModel<VolumeStory> {

    @BelongsTo(() => Story)
    story!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    story_id!: number;

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

export default VolumeStory;
