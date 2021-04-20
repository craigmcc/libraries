// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

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
import Library from "./Library";
import {
    validateLibraryId
} from "../util/async-validators";
import {BadRequest} from "../util/http-errors";
import Author from "./Author";
import AuthorSeries from "./AuthorSeries";
import SeriesStory from "./SeriesStory";
import Story from "./Story";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "series",
    validate: {
        isLibraryIdValid: async function(this: Series): Promise<void> {
            if (!(await validateLibraryId(this.library_id))) {
                throw new BadRequest
                (`library_id: Invalid library_id ${this.library_id}`);
            }
        },
    },
})
export class Series extends AbstractModel<Series> {

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

    @BelongsToMany(() => Author, () => AuthorSeries)
    authors!: Array<Author & {AuthorSeries: AuthorSeries}>;

    @Column({
        allowNull: true,
        field: "copyright",
        type: DataType.STRING
    })
    copyright?: string;

    @BelongsTo(() => Library)
    library!: Library;

    @ForeignKey(() => Library)
    @Index("ix_series_library_id_name")
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

    @Index("ix_series_library_id_name")
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

    @BelongsToMany(() => Story, () => SeriesStory)
    stories!: Array<Story & {SeriesStory: SeriesStory}>;

}

export default Series;
