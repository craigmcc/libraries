// BaseCommonServices --------------------------------------------------------

// Public helper methods common to both parent and child services implementations.

// External Modules ----------------------------------------------------------

import {FindOptions, Order} from "sequelize";
import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

// Public Objects ------------------------------------------------------------

/**
 * Define standard public methods for services of a Model class (parent or child).
 */
abstract class BaseCommonServices<M extends Model> {

    /**
     * Construct a new services instance for the specified Sequelize Model.
     *
     * @param model                     Model class being supported
     * @param order                     Order object for standard sorting order
     * @param fields                    List of field names for this Model (no "id")
     */
    constructor (model: M, order: Order, fields: string[]) {
        this.fields = fields;
        this.fieldsWithId = [
            ...fields,
            "id",
        ];
        this.key = Object.getPrototypeOf(model).constructor.name.toLowerCase + "Id";
        this.model = model;
        this.name = Object.getPrototypeOf(model).constructor.name;
        this.order = order;
    }

    /**
     * List of field names (no including the "id" field.
     */
    protected readonly fields: string[];

    /**
     * List of field names with the "id" field appended (for update operations).
     */
    protected readonly fieldsWithId: string[];

    /**
     * Name of the primary key reference for the model class we are supporting.
     */
    protected readonly key: string;

    /**
     * The Sequelize Model object this service class will operate on.
     */
    protected readonly model: M;

    /**
     * Name of the model class we are supporting.
     */
    protected readonly name: string;

    /**
     * The standard sorting order for Models of this type.
     */
    protected readonly order: Order;

    /**
     * Merge the dependent include options relevant to this model type from
     * the specified query parameters (if any).  Then call
     * appendPaginationOptions() to merge standard pagination options (if present).
     *
     * @param options                   FindOptions to merge into
     * @param query                     Optional query parameters from HTTP request
     *
     * @returns FindOptions after also calling appendPaginationOptions()
     */
    public abstract appendIncludeOptions(options: FindOptions, query?: object): FindOptions;

    /**
     * Merge the match options relevant to this model type from the specified
     * query parameters (if any).  Then call this.appendIncludeOptions() to
     * merge include options for child tables, and standard pagination options.
     *
     * @param options                   FindOptions to merge into
     * @param query                     Optional query parameters from HTTP request
     *
     * @returns FindOptions after also calling appendIncludeOptions()
     */
    public abstract appendMatchOptions(options: FindOptions, query?: object): FindOptions;

}

export default BaseCommonServices;
