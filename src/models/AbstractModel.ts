// AbstractModel -------------------------------------------------------------

// Abstract base class for Sequelize model classes used in this project.

// External Modules ----------------------------------------------------------

import { Column, DataType, Model, Table }
    from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

@Table({
    timestamps: false,
    version: false
})
export abstract class AbstractModel<Model> extends Model {

    @Column({
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataType.INTEGER
    })
    id?: number;

}

export default AbstractModel;
