// User ----------------------------------------------------------------------

// Authorized user for this application.

// External Modules ----------------------------------------------------------

import {Column, DataType, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import {BadRequest} from "../util/http-errors";
import {validateUserUsernameUnique} from "../util/async-validators";

// Public Objects ------------------------------------------------------------

@Table({
    tableName: "users",
    validate: {
        isUserUsernameUnique: async function (this: User): Promise<void> {
            if (!(await validateUserUsernameUnique(this))) {
                throw new BadRequest
                (`username: Username '${this.username}' is already in use`);
            }
        }
    }
})
export class User extends AbstractModel<User> {

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
        field: "password",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "password: Is required"
            },
        }
    })
    password!: string;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.STRING,
        validate: {
            notNull: {
                msg: "scope: Is required"
            },
        }
    })
    scope!: string;

    @Column({
        allowNull: false,
        field: "username",
        type: DataType.STRING,
        unique: "uniqueUserUsername",
        validate: {
            notNull: {
                msg: "username: Is required"
            },
        }
    })
    username!: string;

}

export default User;
