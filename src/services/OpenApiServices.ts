// OpenApiServices -----------------------------------------------------------

// Generate (and cache) the OpenAPI description file for this application's API.

// External Modules ----------------------------------------------------------

const pluralize = require("pluralize");
pluralize.addIrregularRule("series", "serieses"); // Yes, English is weird sometimes

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

// Appliation Models
const AUTHOR = "Author";
const ERROR = "Error";
const LIBRARY = "Library";
const SERIES = "Series";
const STORY = "Story";
const USER = "User";
const VOLUME = "Volume";

// Application Path Parameters
const AUTHOR_ID = "author_id";
const LIBRARY_ID = "library_id";
const SERIES_ID = "series_id";
const STORY_ID = "story_id";
const VOLUME_ID = "volume_id";

// Application Query Parameters
const LIMIT = "limit";
const OFFSET = "offset";
const WITH_AUTHORS = "withAuthors";
const WITH_LIBRARY = "withLibrary";
const WITH_SERIES = "withSeries";
const WITH_STORIES = "withStories";
const WITH_VOLUMES = "withVolumes";

// Application Properties
const ACTIVE = "active";
const COPYRIGHT = "copyright";
const ID = "id";
const NAME = "name";
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
    parameters[AUTHOR_ID] = new ob.ParameterObjectBuilder("path", AUTHOR_ID)
        .addDescription("ID of the specified Author")
        .build();
    parameters[LIBRARY_ID] = new ob.ParameterObjectBuilder("path", LIBRARY_ID)
        .addDescription("ID of the owning Library")
        .build();
    parameters[SERIES_ID] = new ob.ParameterObjectBuilder("path", SERIES_ID)
        .addDescription("ID of the specified Series")
        .build();
    parameters[STORY_ID] = new ob.ParameterObjectBuilder("path", STORY_ID)
        .addDescription("ID of the specified Story")
        .build();
    parameters[VOLUME_ID] = new ob.ParameterObjectBuilder("path", VOLUME_ID)
        .addDescription("ID of the specified Volume")
        .build();

    return parameters;
}

const schemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[AUTHOR] = authorSchema();
    schemas[pluralize(AUTHOR)] = arraySchema(AUTHOR);
    schemas[ERROR] = errorSchema();
    schemas[LIBRARY] = librarySchema();
    schemas[pluralize(LIBRARY)] = arraySchema(LIBRARY);
    schemas[SERIES] = seriesSchema();
    schemas[pluralize(SERIES)] = arraySchema(SERIES);
    schemas[STORY] = storySchema();
    schemas[pluralize(STORY)] = arraySchema(STORY);
    schemas[USER] = userSchema();
    schemas[pluralize(USER)] = arraySchema(USER);
    schemas[VOLUME] = volumeSchema();
    schemas[pluralize(VOLUME)] = arraySchema(VOLUME);
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
    return new ob.SchemaObjectBuilder("boolean", `Is this ${model} active?`, true)
        .build();
}

// An array of the schema objects for the specified model
const arraySchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(model))
        .addType("array")
        .build();
}

const copyrightSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("boolean", `Copyright year for this ${model}`, true)
        .build();
}

// ID is ignored on create transactions, so it is technically nullable
const idSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("integer", `Primary key of this ${model}`, true)
        .build();
}

const libraryIdSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("integer", `Primary key of the Library that owns this ${model}`, false)
        .build();
}

const nameSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("string", `Canonical name of this ${model}`, false)
        .build();
}

const notesSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("string", `General notes about this ${model}`, true)
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
        // TODO - series (plural)
        // TODO - stories
        // TODO - volume
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

const librarySchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(LIBRARY))
        .addProperty(ACTIVE, activeSchema(LIBRARY))
        .addProperty(NAME, nameSchema(LIBRARY))
        .addProperty(NOTES, notesSchema(LIBRARY))
        .addProperty("scope", new ob.SchemaObjectBuilder("string", "Scope(s) required to access this Library")
            .build())
        // TODO - authors
        // TODO - series (plural)
        // TODO - stories
        // TODO - volumes
        .build();
}

const librariesSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(LIBRARY))
        .addType("array")
        .build();
}

// Series Objects ------------------------------------------------------------

const seriesSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(SERIES))
        .addProperty(ACTIVE, activeSchema(SERIES))
        .addProperty(COPYRIGHT, copyrightSchema(SERIES))
        .addProperty(LIBRARY_ID, libraryIdSchema(SERIES))
        .addProperty(NAME, nameSchema(SERIES))
        .addProperty(NOTES, notesSchema(SERIES))
        // TODO - authors
        // TODO - stories
        .build();
}

// Story Objects -------------------------------------------------------------

const storySchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(STORY))
        .addProperty(ACTIVE, activeSchema(STORY))
        .addProperty(COPYRIGHT, copyrightSchema(STORY))
        .addProperty(LIBRARY_ID, libraryIdSchema(STORY))
        .addProperty(NAME, nameSchema(STORY))
        .addProperty(NOTES, notesSchema(STORY))
        .addProperty("ordinal", new ob.SchemaObjectBuilder("integer", "Ordinal sequence (if retrieved as a Series child", true)
            .build())
        // TODO - authors
        .build();
}

// User Objects --------------------------------------------------------------

const userSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(USER))
        .addProperty(ACTIVE, activeSchema(USER))
        .addProperty("level", new ob.SchemaObjectBuilder("string", "Debug detail level for this user's actions", false)
            .addDeprecated(true)
            .build())
        .addProperty("password", new ob.SchemaObjectBuilder("string", "Login password (only on create/update", true)
            .build())
        .addProperty("scope", new ob.SchemaObjectBuilder("string", "Scope(s) authorized for this User", false)
            .build())
        .addProperty("username", new ob.SchemaObjectBuilder("string", "Login username for this User", false)
            .build())
        .build();
}

// Volume Objects ------------------------------------------------------------

const volumeSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addProperty(ID, idSchema(VOLUME))
        .addProperty(ACTIVE, activeSchema(VOLUME))
        .addProperty(COPYRIGHT, copyrightSchema(VOLUME))
        .addProperty("google_id", new ob.SchemaObjectBuilder("string", "Google ID of this Volume", true)
            .build())
        .addProperty("isbn", new ob.SchemaObjectBuilder("string", "Canonical ISBN identifier for this Volume (11 or 13 digits)", true)
            .build())
        .addProperty(LIBRARY_ID, libraryIdSchema(VOLUME))
        .addProperty(NAME, nameSchema(VOLUME))
        .addProperty(NOTES, notesSchema(VOLUME))
        // TODO - authors
        // TODO - stories
        .build();
}
