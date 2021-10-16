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
    authorId!: number;

    @Column({
        allowNull: false,
        defaultValue: false,
        field: "principal",
        type: DataType.BOOLEAN,
    })
    principal!: boolean;

    @BelongsTo(() => Story)
    story!: Story;

    @Column({
        allowNull: false,
        field: "story_id",
        type: DataType.INTEGER,
    })
    @ForeignKey(() => Story)
    storyId!: number;

}

export default AuthorStory;
