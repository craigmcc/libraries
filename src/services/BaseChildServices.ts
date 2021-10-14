// BaseChildServices ---------------------------------------------------------

// Abstract base class for Services implementation for a child Model class
// (one that is dependent on a parent instance for ownership).

// External Modules ----------------------------------------------------------

import {FindOptions, Order, ValidationError} from "sequelize";
import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

import BaseCommonServices from "./BaseCommonServices";
import {BadRequest, NotFound, NotUnique, ServerError} from "../util/HttpErrors";

// Public Objects ------------------------------------------------------------

/**
 * Define standard CRUD operations for services of a parent Model class.
 *
 * @param M                             Model class of the child being supported
 * @param P                             Model class of the required parent
 */
abstract class BaseChildServices<M extends Model, P extends Model> extends BaseCommonServices<M> {

    /**
     * Construct a new services instance for the specified child Sequelize Model.
     *
     * @param parent                    Model instance of parent being supported
     * @param child                     Model instance of child being supported
     * @param fields                    List of field names for this Model (no "id")
     * @param order                     Order object for standard sorting order
     *
     */
    constructor (parent: P, child: M, order: Order, fields: string[]) {
        super(child, order, fields);
        this.parentInstance = parent;
        this.parentKey = Object.getPrototypeOf(parent).constructor.name.toLowerCase() + "Id";
        this.parentName = Object.getPrototypeOf(parent).constructor.name;
    }

    /**
     * Sequelize Model instance of the parent for this service class's model.
     */
    protected readonly parentInstance: P;

    /**
     * Name of the primary key reference for the parent model class.
     */
    protected readonly parentKey: string;

    /**
     * Name of the parent model class.
     */
    protected readonly parentName: string;

    // Standard CRUD Operations ----------------------------------------------

    /**
     * Return all child instances that match the specified criteria.
     *
     * @param parentId                  ID of the required parent instance
     * @param query                     Optional match query parameters from HTTP request
     *
     * @returns List of matching child instances
     */
    public async all(parentId: number, query?: object): Promise<M[]> {
        await this.readParent(`${this.name}Services.all`, parentId);
        const options: FindOptions = this.appendMatchOptions({
            order: this.order,
            where: {
                [`${this.parentKey}`]: parentId,
            }
        }, query);
        return await Object.getPrototypeOf(this.model).constructor.findAll(options);
    }

    /**
     * Return the child instance with the specified ID.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Optional include query parameters from the HTTP request
     *
     * @returns Requested model
     *
     * @throws NotFound if the requested child instance cannot be found
     */
    public async find(parentId: number, childId: number, query?: any): Promise<M> {
        return await this.read(
            `${this.name}Services.find`,
            parentId,
            childId,
            query
        );
    }

    /**
     * Insert and return a new child instance with the specified contents.
     *
     * @param parentId                  ID of the required parent model instance
     * @param child                     Object containing fields for the inserted instance
     *
     * @returns Inserted child instance (with "id" field)
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async insert(parentId: number, child: M): Promise<M> {
        await this.readParent(`${this.name}Services.insert`, parentId);
        try {
            child = {
                ...child,
                [`${this.parentKey}`]: parentId, // No cheating
            };
            return await Object.getPrototypeOf(this.model).constructor.create(child, {
                fields: this.fields,
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
                    `${this.name}.insert`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}.insert`
                );
            }
        }
    }

    /**
     * Remove and return an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     *
     * @returns Removed child instance
     *
     * @throws NotFound if the specified child instance does not exist
     */
    public async remove(parentId: number, childId: number): Promise<M> {
        const child: M = await this.read(`${this.name}Services.remove`, parentId, childId);
        await Object.getPrototypeOf(this.model).constructor.destroy({
            where: { id: childId }
        });
        return child;
    }

    /**
     * Update and return an existing child instance.
     *
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param child                     Object containing fields to be updated
     *
     * @returns Updated child instance
     *
     * @throws BadRequest if validation error(s) occur
     * @throws NotFound if the specified model instance does not exist
     * @throws NotUnique if a unique key violation is attempted
     * @throws ServerError if some other error occurs
     */
    public async update(parentId: number, childId: number, child: M): Promise<M> {
        await this.readParent(`${this.name}Services.update`, parentId);
        try {
            child = {
                ...child,
                id: childId, // No cheating
                [`${this.parentKey}`]: parentId, // No cheating
            };
            const results = await Object.getPrototypeOf(this.model).constructor.update(child, {
                fields: this.fieldsWithId,
                returning: true,
                where: {id: childId},
            });
            if (results[0] < 1) {
                throw new NotFound(
                    `${this.key}: Missing ${this.name} ${childId}`,
                    `${this.name}.update`
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
                    `${this.name}Services.update`
                );
            } else {
                throw new ServerError(
                    error as Error,
                    `${this.name}Services.update`
                );
            }
        }
    }

    // Public Helper Methods -------------------------------------------------

    /**
     * Find and return the requested child instance.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the required parent instance
     * @param childId                   ID of the requested child instance
     * @param query                     Optional include query parameters
     *
     * @returns Requested child instance
     *
     * @throws BadRequest if this child instance does not exist
     */
    public async read(context: string, parentId: number,  childId: number, query?: any): Promise<M> {
        const parent = await this.readParent(context, parentId);
        const options: FindOptions = this.appendIncludeOptions({
            where: {
                id: childId,
                [`${this.parentKey}`]: parentId,
            }
        }, query);
        const child = await Object.getPrototypeOf(this.model).constructor.findOne(options);
        if (child) {
            return child;
        } else {
            throw new NotFound(
                `${this.key}: Missing ${this.name} ${childId}`,
                context,
            );
        }
    }

    /**
     * Find and return the requested parent model instance.
     *
     * @param context                   Call context for error messages
     * @param parentId                  ID of the required parent intance
     *
     * @returns Requested parent model instance
     *
     * @throws NotFound if this parent model instance does not exist
     */
    public async readParent(context: string, parentId: number): Promise<P> {
        const parent = await Object.getPrototypeOf(this.parentInstance).constructor.findByPk(parentId);
        if (parent) {
            return parent;
        } else {
            throw new NotFound(
                `${this.parentKey}: Missing ${this.parentName} ${parentId}`,
                context,
            );
        }
    }

}

export default BaseChildServices;
