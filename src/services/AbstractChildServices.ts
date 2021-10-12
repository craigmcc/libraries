// AbstractChildServices -----------------------------------------------------

// Abstract base class for Services implementations with standard CRUD methods,
// for Models that do require a libraryId argument, because they all belong
// to the specified Library.

// External Modules ----------------------------------------------------------

import {Model} from "sequelize-typescript";

// Internal Modules ----------------------------------------------------------

// Public Classes ------------------------------------------------------------

/**
 * <p>Define the standard CRUD operations that every service implementation
 * must support.</p>
 */
abstract class AbstractChildServices<M extends Model> {

    /**
     * <p>Return all matching models of the specified type.</p>
     */
    public abstract all(libraryId: number, query?: any): Promise<M[]>;

    /**
     * <p>Return the model with the specified id.</p>
     *
     * @param id ID of the model to find
     */
    public abstract find(libraryId: number, id: number, query?: any): Promise<M>;

    /**
     * <p>Insert a new model instance, and return it with populated
     * standard values.</p>
     *
     * @param model Model to be inserted
     */
    public abstract insert(libraryId: number, model: any): Promise<M>;

    /**
     * <p>Remove the model with the specified id, and return the
     * model that was removed.</p>
     *
     * @param id ID of the model to remove
     */
    public abstract remove(libraryId: number, id: number): Promise<M>;

    /**
     * <p>Update the model with the specified id and new data,
     * and return it with populated standard values.</p>
     *
     * @param id ID of the model to update
     * @param model Model containing updated values
     */
    public abstract update(libraryId: number, id: number, model: any): Promise<M>

}

export default AbstractChildServices;
