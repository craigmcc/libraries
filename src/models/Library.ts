// Library -------------------------------------------------------------------

// Overall collection of authors, series, stories, and volumes.

// External Modules ----------------------------------------------------------

import { Column, DataType, HasMany, Table } from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "libraries",
    validate: {
        // TODO - libraries validate
    }
})
export class Library extends AbstractModel<Library> {

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
        allowNull: false,
        field: "name",
        type: DataType.STRING,
        unique: "uniqueLibraryName",
        validate: {
            notNull: {
                msg: "name: Is required"
            },
            // TODO - name validate
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
        field: "scope",
        type: DataType.STRING,
        unique: true,
        validate: {
            notNull: {
                msg: "scope: Is required"
            },
            // TODO - scope validate
        }
    })
    scope!: string;

}

export default Library;
