// OpenApiServices -----------------------------------------------------------

// Generate (and cache) the OpenAPI description file for this application's API.

// External Modules ----------------------------------------------------------

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

// Public Objects ============================================================

let RESULT:string = "";

export const generateOpenApi = (): string => {
    if (RESULT === "") {
        const builder = new ob.OpenApiObjectBuilder(info())
            .addComponents(components())
            .addPathItems(pathItems())
            ;
        RESULT = builder.asJson();
    }
    return RESULT;
}

// Top Level Objects =========================================================

const components = (): ob.ComponentsObject => {
    return new ob.ComponentsObjectBuilder()
        .addParameters(parameters())
        .addSchemas(schemas())
        // TODO
        .build();
}

const contact = (): ob.ContactObject => {
    return new ob.ContactObjectBuilder()
        .addEmail("craigmcc@gmail.com")
        .addName("Craig McClanahan")
        .build();
}

const info = (): ob.InfoObject => {
    return new ob.InfoObjectBuilder("Libraries Application", "1.0.0")
        .addContact(contact())
        .addDescription("Manage one or more Libraries and related contents")
        .addLicense(license())
        .build();
}

const license = (): ob.LicenseObject => {
    return new ob.LicenseObjectBuilder("Apache-2.0")
        .addUrl("https://apache.org/licenses/LICENSE-2.0")
        .build();
}

const pathItems = (): ob.PathsObject => {
    const pathItems: ob.PathsObject = {};
    // TODO
    return pathItems;
}

// Application Specific Objects ==============================================

// Generic Models
const AUTHOR = "Author";
const ERROR = "Error";
const LIBRARY = "Library";
const SERIES = "Series";
const STORY = "Story";
const USER = "User";
const VOLUME = "Volume";

// Generic Path Parameters
const LIBRARY_ID_PARAM = "libraryId";

// Generic Query Parameters
const LIMIT = "limit";
const OFFSET = "offset";
const WITH_AUTHORS = "withAuthors";
const WITH_LIBRARY = "withLibrary";
const WITH_SERIES = "withSeries";
const WITH_STORIES = "withStories";
const WITH_VOLUMES = "withVolumes";

// Generic Properties
const ACTIVE = "active";
const ID = "id";
const LIBRARY_ID = "library_id";
const NOTES = "notes";

// Combination Objects -------------------------------------------------------

const parameters = (): ob.ParametersObject => {
    const parameters: ob.ParametersObject = {};

    // Child inclusion parameters (query)
    parameters[WITH_AUTHORS] = new ob.ParameterObjectBuilder("query", WITH_AUTHORS)
        .addAllowEmptyValue(true)
        .build();
    parameters[WITH_LIBRARY] = new ob.ParameterObjectBuilder("query", WITH_LIBRARY)
        .addAllowEmptyValue(true)
        .build();
    parameters[WITH_SERIES] = new ob.ParameterObjectBuilder("query", WITH_SERIES)
        .addAllowEmptyValue(true)
        .build();
    parameters[WITH_STORIES] = new ob.ParameterObjectBuilder("query", WITH_STORIES)
        .addAllowEmptyValue(true)
        .build();
    parameters[WITH_VOLUMES] = new ob.ParameterObjectBuilder("query", WITH_VOLUMES)
        .addAllowEmptyValue(true)
        .build();

    // Generic pagination parameters (query)
    parameters[LIMIT] = new ob.ParameterObjectBuilder("query", LIMIT)
        .addDescription("Maximum number of rows returned (default is 25)")
        .build();
    parameters[OFFSET] = new ob.ParameterObjectBuilder("query", OFFSET)
        .addDescription("Zero-relative offset to the first returned row (default is 0)")
        .build();

    // Object ID parameters (path)
    parameters[LIBRARY_ID_PARAM] = new ob.ParameterObjectBuilder("path", LIBRARY_ID_PARAM)
        .addDescription("ID of the owning Library")
        .build();

    return parameters;
}

const schemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[AUTHOR] = authorSchema();
    schemas[ERROR] = errorSchema();
    // TODO
    return schemas;
}

// Component References ------------------------------------------------------

const parameterRef = (parameter: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/parameters/${parameter}`)
        .build();
}

const requestBodyRef = (requestBody: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/requestBodies/${requestBody}`)
        .build();
}

const responseRef = (response: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/responses/${response}`)
        .build();
}

const schemaRef = (schema: string): ob.ReferenceObject => {
    return new ob.ReferenceObjectBuilder(`#/components/schemas/${schema}`)
        .build();
}

// Generic Objects -----------------------------------------------------------

const activeSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("boolean", `Is this ${model} active?`)
        .build();
}

const idSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("integer", `Primary key of this ${model}`)
        .build();
}

const libraryIdSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("integer", `ID of the Library that owns this ${model}`)
        .build();
}

const notesSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("string", `General notes about this ${model}`)
        .addNullable(true)
        .build();
}

// Author Objects ------------------------------------------------------------

const authorSchema = (): ob.SchemasObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(AUTHOR))
        .addProperty(ACTIVE, activeSchema(AUTHOR))
        .addProperty("first_name", new ob.SchemaObjectBuilder("string", "Author's First Name")
            .addNullable(false)
            .build())
        .addProperty("last_name", new ob.SchemaObjectBuilder("string", "Author's Last Name")
            .addNullable(false)
            .build())
        .addProperty(LIBRARY_ID, libraryIdSchema(AUTHOR))
        .addProperty(NOTES, notesSchema(AUTHOR))
        // TODO - child series/stories/volumes arrays (if requested)
        .build();
}

// Error Objects -------------------------------------------------------------

const errorSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addExample({
            description: "Library Not Found Error",
            value: {
                context: "LookupServices.find",
                inner: "... Nested service exception (only on a POST) ...",
                message: "Missing Library 123",
                status: 404,
            }
        })
        .addProperty("context", new ob.SchemaObjectBuilder("string", "Error source location")
            .build())
/* TODO - should really allow "string | Error" (but this is only on POSTs anyway
        .addProperty("inner", new ob.SchemaObjectBuilder("object", "Nested exception we are wrapping")
            .build())
*/
        .addProperty("message", new ob.SchemaObjectBuilder("string", "Error message summary")
            .build())
        .addProperty("status", new ob.SchemaObjectBuilder("integer", "HTTP status code")
            .build())
        .addType("object")
        .build();
}

// Library Objects -----------------------------------------------------------

// Series Objects ------------------------------------------------------------

// Story Objects -------------------------------------------------------------

// User Objects --------------------------------------------------------------

// Volume Objects ------------------------------------------------------------

