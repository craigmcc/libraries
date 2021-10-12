// Story ---------------------------------------------------------------------

// Individual story or novel, may be a participant in one or more Series,
// published in one or more Volumes, and written by one or more Authors.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Index,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import AuthorStory from "./AuthorStory";
import Library from "./Library";
import Series from "./Series";
import SeriesStory from "./SeriesStory";
import Volume from "./Volume";
import VolumeStory from "./VolumeStory";
import {validateLibraryId} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "stories",
    validate: {
        isLibraryIdValid: async function(this: Story): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Invalid library_id ${this.libraryId}`);
            }
        },
    },
})
export class Story extends AbstractModel<Story> {

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

    @BelongsToMany(() => Author, () => AuthorStory)
    authors!: Array<Author & {AuthorStory: AuthorStory}>;

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    copyright?: string;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Index("ix_stories_library_id_name")
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
    libraryId!: number;

    @Index("ix_stories_library_id_name")
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

    @BelongsToMany(() => Series, () => SeriesStory)
    series!: Array<Series & {SeriesStory: SeriesStory}>;

    @BelongsToMany(() => Volume, () => VolumeStory)
    volumes!: Array<Volume & {VolumeStory: VolumeStory}>;

}

export default Story;
