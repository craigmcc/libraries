// AuthorStory ---------------------------------------------------------------

// Join table for Authors of Stories.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import Story from "./Story";

// Public Objects -----------------------------------------------------------

@Table({
    tableName: "authors_stories"
})
export class AuthorStory extends AbstractModel<AuthorStory> {

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

    @BelongsTo(() => Story)
    volume!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    story_id!: number;

}

export default AuthorStory;
