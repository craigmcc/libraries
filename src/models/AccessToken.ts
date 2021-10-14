// AccessToken ---------------------------------------------------------------

// OAuth access token created by @craigmcc/oauth-orchestrator.

// External Modules ----------------------------------------------------------

import {BelongsTo, Column, DataType, ForeignKey, Table} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import AbstractModel from "./AbstractModel";
import User from "./User";
import {validateAccessTokenTokenUnique} from "../util/AsyncValidators";
import {BadRequest} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

@Table({
    modelName: "accessToken",
    tableName: "access_tokens",
    validate: {
        isTokenUnique: async function(this: AccessToken): Promise<void> {
            if (!(await validateAccessTokenTokenUnique(this))) {
                throw new BadRequest(`token: Token '${this.token}' is already in use`);
            }
        }
    }
})
class AccessToken extends AbstractModel<AccessToken> {

    @Column({
        allowNull: false,
        field: "expires",
        type: DataType.DATE,
        validate: {
            notNull: {
                msg: "expires: Is required",
            }
        }
    })
    expires!: Date;

    @Column({
        allowNull: false,
        field: "scope",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "scope: Is required",
            }
        }
    })
    scope!: string;

    @Column({
        allowNull: false,
        field: "token",
        type: DataType.TEXT,
        validate: {
            notNull: {
                msg: "token: Is required",
            }
        }
    })
    token!: string

    @BelongsTo(() => User, {
        foreignKey: {
            allowNull: false,
        },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    })
    user!: User;

    @ForeignKey(() => User)
    @Column({
        allowNull: false,
        field: "user_id",
        type: DataType.INTEGER,
        validate: {
            notNull: {
                msg: "userId: Is required",
            }
        }
    })
    userId!: number;

}

export default AccessToken;
