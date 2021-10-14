// BaseParentServices --------------------------------------------------------

// Abstract base class for Services implementations for a parent Model class
// (one that does not require a libraryId parameter for dependent children).

// External Modules ----------------------------------------------------------

import {FindOptions, Order, ValidationError} from "sequelize";
import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import BaseCommonServices from "./BaseCommonServices";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a parent Model class.
 */
abstract class BaseParentServices<M extends Model> extends BaseCommonServices<M> {

    /**
     * Construct a new services instance for the specified Sequelize Model.
     *
     * @param model                     Model class being supported
     * @param fields                    List of field names for this Model (no "id")
     * @param order                     Order object for standard sorting order
     *
     */
    constructor (model: M, order: Order, fields: string[]) {
        super(model, order, fields);
    }

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all model instances that match the specified criteria.
     *
     * @param query                     Optional match query parameters from HTTP request
     *
     * @returns List of matching model instances
     */
    public async all(query?: object): Promise<M[]> {
        const options: FindOptions = this.appendMatchOptions({
            order: super.order,
        }, query);
        return await Object.getPrototypeOf(super.model).constructor.findAll(options);
    }

    /**
     * Return the model instance with the specified ID.
     *
     * @param parentId                  ID of the requested parent model instance
     * @param query                     Optional include query parameters from the HTTP request
     *
     * @returns Requested model
     *
     * @throws NotFound if the requested model instance cannot be found
     */
    public async find(parentId: number, query?: any): Promise<M> {
        return await this.read(
            `${super.name}.find`,
            parentId,
            query
        );
    }

    /**
     * Insert and return a new model instance with the specified contents.
     *
     * @param parent                    Object containing fields for the inserted instance
     *
     * @returns Inserted model (with "id" field)
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async insert(parent: M): Promise<M> {
        try {
            return await Object.getPrototypeOf(super.model).constructor.create(parent, {
                fields: super.fields,
            });
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${super.name}.insert`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${super.name}.insert`
                );
            }
        }
    }

    /**
     * Remove and return an existing model instance.
     *
     * @param parentId                  ID of the specified model instance
     *
     * @returns Removed model
     *
     * @throws NotFound if the specified model instance does not exist
     */
    public async remove(parentId: number): Promise<M> {
        const model: M = await this.read(`${super.name}.remove`, parentId);
        await Object.getPrototypeOf(super.model).constructor.destroy({
            where: { id: parentId }
        });
        return model;
    }

    /**
     * Update and return an existing model.
     *
     * @param parentId                  ID of the specified model
     * @param parent                    Object containing fields to be updated
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async update(parentId: number, parent: M): Promise<M> {
        try {
            parent.id = parentId; // No cheating
            const results = await Object.getPrototypeOf(super.model).constructor.update(parent, {
                fields: super.fieldsWithId,
                returning: true,
                where: {id: parentId},
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `${super.key}: Missing ${super.name} ${parentId}`,
                    `${super.name}.update`
                );
            }
            return results[1][0];
        } catch (error) {
            if (error instanceof BadRequest) {
                throw error;
            } else if (error instanceof NotFound) {
                throw error;
            } else if (error instanceof NotUnique) {
                throw error;
            } else if (error instanceof ValidationError) {
                throw new BadRequest(
                    error,
                    `${super.name}.insert`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${super.name}.insert`
                );
            }
        }
    }

    // Public Helper Methods -------------------------------------------------

    /**
     * Find and return the requested parent model.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the requested parent model
     * @param query                     Optional include query parameters
     *
     * @returns Requested model
     *
     * @throws BadRequest if this model does not exist
     */
    public async read(context: string, parentId: number, query?: any): Promise<M> {
        const options: FindOptions = this.appendIncludeOptions({
            where: { id: parentId }
        }, query);
        const parent = await Object.getPrototypeOf(super.model).constructor.findOne(options);
        if (parent) {
            return parent;
        } else {
            throw new NotFound(
                `${super.key}: Missing ${super.name} ${parentId}`,
                context,
            );
        }

    }

}

export default BaseParentServices;
