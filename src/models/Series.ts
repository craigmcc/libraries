// Series --------------------------------------------------------------------

// A named and ordered list of Stories in the same timeline.

// External Modules ----------------------------------------------------------

import {
    BelongsTo,
    BelongsToMany,
    Column,
    DataType,
    ForeignKey,
    Table
} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import Author from "./Author";
import AuthorSeries from "./AuthorSeries";
import Library from "./Library";
import SeriesStory from "./SeriesStory";
import Story from "./Story";
import {validateLibraryId} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "series",
    validate: {
        isLibraryIdValid: async function(this: Series): Promise<void> {
            if (!(await validateLibraryId(this.libraryId))) {
                throw new BadRequest
                    (`libraryId: Invalid libraryId ${this.libraryId}`);
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
    @Column({
        allowNull: false,
        field: "library_id",
        type: DataType.INTEGER,
        unique: "uniqueNameWithinLibrary",
        validate: {
            notNull: {
                msg: "libraryId: Is required"
            }
        },
    })
    libraryId!: number;

    @Column({
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        unique: "uniqueNameWithinLibrary",
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
