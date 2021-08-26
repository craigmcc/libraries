// OpenApiServices -----------------------------------------------------------

// Generate (and cache) the OpenAPI description file for this application's API.

// External Modules ----------------------------------------------------------

import {MediaTypeObjectBuilder} from "@craigmcc/openapi-builders";

const pluralize = require("pluralize");
pluralize.addIrregularRule("series", "serieses"); // Disambiguate for the exception

import * as ob from "@craigmcc/openapi-builders";

// Internal Modules ----------------------------------------------------------

// Public Objects ============================================================

let GENERATED:string = "";

export const generateOpenApi = (): string => {
    if (GENERATED === "") {
        const builder = new ob.OpenApiObjectBuilder(info())
            .addComponents(components())
            .addPathItems(paths())
            ;
        GENERATED = builder.asJson();
    }
    return GENERATED;
}

// Top Level Objects =========================================================

const components = (): ob.ComponentsObject => {
    return new ob.ComponentsObjectBuilder()
        .addParameters(parameters())
        .addRequestBodies(requestBodies())
        .addResponses(responses())
        .addSchemas(schemas())
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

// Components Level Objects ==================================================

const parameters = (): ob.ParametersObject => {
    const parameters: ob.ParametersObject = {};

    // Child inclusion parameters (query)
    parameters[WITH_AUTHORS] = new ob.ParameterObjectBuilder("query", WITH_AUTHORS)
        .addAllowEmptyValue(true)
        .addDescription("Include nested child Authors")
        .build();
    parameters[WITH_LIBRARY] = new ob.ParameterObjectBuilder("query", WITH_LIBRARY)
        .addAllowEmptyValue(true)
        .addDescription("Include nested parent Library")
        .build();
    parameters[WITH_SERIES] = new ob.ParameterObjectBuilder("query", WITH_SERIES)
        .addAllowEmptyValue(true)
        .addDescription("Include nested child Series")
        .build();
    parameters[WITH_STORIES] = new ob.ParameterObjectBuilder("query", WITH_STORIES)
        .addAllowEmptyValue(true)
        .addDescription("Include nested child Stories")
        .build();
    parameters[WITH_VOLUMES] = new ob.ParameterObjectBuilder("query", WITH_VOLUMES)
        .addAllowEmptyValue(true)
        .addDescription("Include nested child Volumes")
        .build();

    // Filter parameters (query)
    parameters[NAME] = new ob.ParameterObjectBuilder("query", NAME)
        .addDescription("Filter on name match")
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
    parameters[USER_ID] = new ob.ParameterObjectBuilder("path", USER_ID)
        .addDescription("ID of the specified User")
        .build();
    parameters[VOLUME_ID] = new ob.ParameterObjectBuilder("path", VOLUME_ID)
        .addDescription("ID of the specified Volume")
        .build();

    return parameters;
}

// Technically top level, but fits more logically here
const paths = (): ob.PathsObject => {
    const paths: ob.PathsObject = {};

    paths[suffixItems(AUTHOR)] = pathItems(AUTHOR);
    paths[suffixItem(AUTHOR)] = pathItem(AUTHOR);
    paths[suffixChildren(AUTHOR, SERIES)] = pathChildren(AUTHOR, SERIES);
    paths[suffixChildren(AUTHOR, STORY)] = pathChildren(AUTHOR, STORY);
    paths[suffixChildren(AUTHOR, VOLUME)] = pathChildren(AUTHOR, VOLUME);

    paths[suffixItems(LIBRARY)] = pathItems(LIBRARY);
    paths[suffixItem(LIBRARY)] = pathItem(LIBRARY);
    paths[suffixChildren(LIBRARY, AUTHOR)] = pathChildren(LIBRARY, AUTHOR);
    paths[suffixChildren(LIBRARY, SERIES)] = pathChildren(LIBRARY, SERIES);
    paths[suffixChildren(LIBRARY, STORY)] = pathChildren(LIBRARY, STORY);
    paths[suffixChildren(LIBRARY, VOLUME)] = pathChildren(LIBRARY, VOLUME);

    paths[suffixItems(SERIES)] = pathItems(SERIES);
    paths[suffixItem(SERIES)] = pathItem(SERIES);
    paths[suffixChildren(SERIES, AUTHOR)] = pathChildren(SERIES, AUTHOR);
    paths[suffixChildren(SERIES, STORY)] = pathChildren(SERIES, STORY);

    paths[suffixItems(STORY)] = pathItems(STORY);
    paths[suffixItem(STORY)] = pathItem(STORY);
    paths[suffixChildren(STORY, AUTHOR)] = pathChildren(STORY, AUTHOR);
    paths[suffixChildren(STORY, SERIES)] = pathChildren(STORY, SERIES);
    paths[suffixChildren(STORY, VOLUME)] = pathChildren(STORY, VOLUME);

    paths[suffixItems(USER)] = pathItems(USER);
    paths[suffixItem(USER)] = pathItem(USER);

    paths[suffixItems(VOLUME)] = pathItems(VOLUME);
    paths[suffixItem(VOLUME)] = pathItem(VOLUME);
    paths[suffixChildren(VOLUME, AUTHOR)] = pathChildren(VOLUME, AUTHOR);
    paths[suffixChildren(VOLUME, STORY)] = pathChildren(VOLUME, STORY);

    return paths;
}

const requestBodies = (): ob.RequestBodiesObject => {
    const requestBodies: ob.RequestBodiesObject = {};
    for (const model of MODELS) {
        requestBodies[model] = modelRequestBody(model);
    }
    return requestBodies;
}

const responses = (): ob.ResponsesObject => {
    const responses: ob.ResponsesObject = {};
    for (const model of MODELS) {
        responses[model] = modelResponse(model);
        responses[pluralize(model)] = modelsResponse(model);
    }
    responses[BAD_REQUEST] = errorResponse("Error in request properties");
    responses[FORBIDDEN] = errorResponse("Requested operation is forbidden");
    responses[NOT_FOUND] = errorResponse("Requested item is not found");
    return responses;
}

const schemas = (): ob.SchemasObject => {
    const schemas: ob.SchemasObject = {};
    schemas[AUTHOR] = authorSchema();
    schemas[pluralize(AUTHOR)] = authorsSchema();
    schemas[ERROR] = errorSchema();
    schemas[LIBRARY] = librarySchema();
    schemas[pluralize(LIBRARY)] = librariesSchema();
    schemas[SERIES] = seriesSchema();
    schemas[pluralize(SERIES)] = seriesesSchema();
    schemas[STORY] = storySchema();
    schemas[pluralize(STORY)] = storiesSchema();
    schemas[USER] = userSchema();
    schemas[pluralize(USER)] = usersSchema();
    schemas[VOLUME] = volumeSchema();
    schemas[pluralize(VOLUME)] = volumesSchema();
    return schemas;
}

// Standard Identifiers ------------------------------------------------------

// HTTP Status Codes
const BAD_REQUEST = "400";
const CREATED = "201";
const FORBIDDEN = "403";
const NOT_FOUND = "404";
const OK = "200";

// Media Types
const APPLICATION_JSON = "application/json";

// Components References -----------------------------------------------------

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

// Application Specific Objects ==============================================

// Application API Prefix
const API = "/api";

// Application Models
const AUTHOR = "Author";
const ERROR = "Error";
const LIBRARY = "Library";
const SERIES = "Series";
const STORY = "Story";
const USER = "User";
const VOLUME = "Volume";

const MODELS = [
    AUTHOR,
    LIBRARY,
    SERIES,
    STORY,
    USER,
    VOLUME,
];

// Application Model Properties
const ACTIVE = "active";
const COPYRIGHT = "copyright";
const ID = "id";
const NAME = "name";
const NOTES = "notes";

// Application Path Parameters
const AUTHOR_ID = "author_id";
const LIBRARY_ID = "library_id";
const SERIES_ID = "series_id";
const STORY_ID = "story_id";
const USER_ID = "user_id";
const VOLUME_ID = "volume_id";

// Application Query Parameters
const LIMIT = "limit";
// NAME is also a query parameter
const OFFSET = "offset";
const WITH_AUTHORS = "withAuthors";
const WITH_LIBRARY = "withLibrary";
const WITH_SERIES = "withSeries";
const WITH_STORIES = "withStories";
const WITH_VOLUMES = "withVolumes";

// Generic Operations --------------------------------------------------------

// Operation that returns an array of the specified model objects
const allOperation = (model: string): ob.OperationObject => {
    const models = pluralize(model);
    return new ob.OperationObjectBuilder()
        .addDescription(`Return all visible ${models}`)
        .addParameter(parameterRef(LIMIT))
        .addParameter(parameterRef(OFFSET))
        .addParameters(filterParameters(model))
        .addParameters(withParameters(model))
        .addResponse(OK, responseRef(models))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addSummary(`The requested ${models}`)
        .build();
}

// Operation that returns an array of the specified children for the specified parent
const childrenOperation = (parent: string, child: string): ob.OperationObject => {
    const children = pluralize(child);
    return new ob.OperationObjectBuilder()
        .addDescription(`Return all ${children} for the specified ${parent}`)
        .addParameter(parameterRef(LIMIT))
        .addParameter(parameterRef(OFFSET))
        .addParameters(filterParameters(parent))
        .addParameters(withParameters(child))
        .addResponse(OK, responseRef(children))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The requested ${children}`)
        .build();
}

// Operation that returns a specified model object
const findOperation = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Return the specified ${model}`)
        .addParameters(withParameters(model))
        .addResponse(OK, responseRef(model))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The requested ${model}`)
        .build();
}

// Operation that creates and returns the specified model object
const insertOperation = (model: string): ob.OperationObject => {
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Create and return the specified ${model}`)
        .addRequestBody(requestBodyRef(model))
        .addResponse(CREATED, responseRef(model))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addSummary(`The created ${model}`);
    if (isChild(model)) {
        builder.addResponse(NOT_FOUND, responseRef(NOT_FOUND));
    }
    return builder.build();
}

// Operation that deletes and returns the specified model object
const removeOperation = (model: string): ob.OperationObject => {
    const builder = new ob.OperationObjectBuilder()
        .addDescription(`Remove and return the specified ${model}`)
        .addResponse(OK, responseRef(model))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The removed ${model}`);
    return builder.build();
}

// Operation that updates and returns the specified model object
const updateOperation = (model: string): ob.OperationObject => {
    return new ob.OperationObjectBuilder()
        .addDescription(`Update and return the specified ${model}`)
        .addRequestBody(requestBodyRef(model))
        .addResponse(OK, responseRef(model))
        .addResponse(FORBIDDEN, responseRef(FORBIDDEN))
        .addResponse(NOT_FOUND, responseRef(NOT_FOUND))
        .addSummary(`The updated ${model}`)
        .build();
}

// Model-specific filter parameters (if any)
const filterParameters = (model: string): ob.ParametersObject => {
    const parameters: ob.ParametersObject = {};
    if (model !== USER) {
        parameters[NAME] = parameterRef(NAME);
    }
    return parameters;
}

// Model-specific "with" parameters (if any)
const withParameters = (model: string): ob.ParametersObject => {
    const parameters : ob.ParametersObject = {};
    // Parent library
    if ((model !== LIBRARY) && (model !== USER)) {
        parameters[WITH_LIBRARY] = parameterRef(WITH_LIBRARY);
    }
    // Relevant children
    if ((model === LIBRARY) || (model === SERIES) || (model === STORY) || (model === VOLUME)) {
        parameters[WITH_AUTHORS] = parameterRef(WITH_AUTHORS);
    }
    if ((model === AUTHOR) || (model === LIBRARY) || (model === STORY)) {
        parameters[WITH_SERIES] = parameterRef(WITH_SERIES);
    }
    if ((model === AUTHOR) || (model === LIBRARY) || (model === SERIES) || (model === VOLUME)) {
        parameters[WITH_STORIES] = parameterRef(WITH_STORIES);
    }
    if ((model === AUTHOR) || (model === LIBRARY) || (model === STORY)) {
        parameters[WITH_VOLUMES] = parameterRef(WITH_VOLUMES);
    }
    return parameters;
}

// Generic Items -------------------------------------------------------------

const errorResponse = (description: string): ob.ResponseObject => {
    return new ob.ResponseObjectBuilder(description)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addExample({
                description: "User Not Found Error",
                value: {
                    context: "UserLookupService",
                    message: "Missing User 123",
                    status: 404,
                }
            })
            .addSchema(schemaRef(ERROR)))
        .build();
}


const modelRequestBody = (model: string): ob.RequestBodyObject => {
    return new ob.RequestBodyObjectBuilder()
        .addContent(APPLICATION_JSON, new MediaTypeObjectBuilder()
            .addSchema(schemaRef(model))
            .build())
        .addRequired(true)
        .build();
}

const modelResponse = (model: string): ob.ResponseObject => {
    return new ob.ResponseObjectBuilder(`The specified ${model}`)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(schemaRef(model))
            .build())
        .build();
}

const modelsResponse = (model: string): ob.ResponseObject => {
    return new ob.ResponseObjectBuilder(`The requested ${pluralize(model)}`)
        .addContent(APPLICATION_JSON, new ob.MediaTypeObjectBuilder()
            .addSchema(new ob.SchemaObjectBuilder()
                .addItems(schemaRef(model))
                .addType("array")
                .build())
            .build())
        .build();
}

// Path for /{models}/{model_id} or /{models}/{library_id}/{model_id}
const pathItem = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .addDelete(removeOperation(model))
        .addGet(findOperation(model))
        .addPut(updateOperation(model))
        .addParameter(new ob.ParameterObjectBuilder("path", pathId(model))
            .addDescription(`ID of the specified ${model}`)
            .build());
    if (isChild(model)) {
        builder.addParameter(new ob.ParameterObjectBuilder("path", "library_id")
            .addDescription(`ID of the owning ${LIBRARY}`)
            .build());
    }
    return builder.build();
}

// Path for /{models} or /{models}/{library_id}
const pathItems = (model: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .addGet(allOperation(model))
        .addPost(insertOperation(model));
    if (isChild(model)) {
        builder.addParameter(new ob.ParameterObjectBuilder("path", "library_id")
            .addDescription(`ID of the owning ${LIBRARY}`)
            .build());
    }
    return builder.build();
}

// Path for /{models}/{children} or /{models}/{library_id}/{children}
const pathChildren = (parent: string, child: string): ob.PathItemObject => {
    const builder = new ob.PathItemObjectBuilder()
        .addGet(childrenOperation(parent, child))
        .addParameters(withParameters(child));
    if (isChild(parent)) {
        builder.addParameter(new ob.ParameterObjectBuilder("path", "library_id")
            .addDescription(`ID of the owning ${LIBRARY}`)
            .build());
    }
    return builder.build();
}


// Calculate the HTTP request path, relative to the server endpoint, of an item's children
const suffixChildren = (parent: string, child: string): string => {
    const plural = (child === SERIES) ? SERIES.toLowerCase() : pluralize(child.toLowerCase());
    return suffixItem(parent) + "/" + plural;
}

// Calculate the HTTP request path, relative to the server endpoint, of an item
const suffixItem = (model: string): string => {
    return suffixItems(model) + "/{" + pathId(model) + "}";
}

// Calculate the HTTP request path, relative to the server endpoint, of a collection
const suffixItems = (model: string): string => {
    const plural = (model === SERIES) ? SERIES.toLowerCase() : pluralize(model.toLowerCase());
    let result = API + "/" + plural;
    if (isChild(model)) {
        result += "/{" + pathId(LIBRARY) + "}";
    }
    return result;
}


// Generic Schemas -----------------------------------------------------------

const activeSchema = (model: string): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder("boolean", `Is this ${model} active?`, true)
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

// Generic Utilities ---------------------------------------------------------

// Is this model a child of a Library?
const isChild = (model: string): boolean => {
    return (model !== LIBRARY) && (model !== USER);
}

// Template variable for the ID of a model
const pathId = (model: string): string => {
    return `${model.toLowerCase()}_id`;
}

// Model Specific Objects ====================================================

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
        .addProperty(SERIES.toLowerCase(), seriesesSchema())
        .addProperty(pluralize(STORY.toLowerCase()), storiesSchema())
        .addProperty(pluralize(VOLUME.toLowerCase()), volumesSchema())
        .build();
}

const authorsSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(AUTHOR))
        .addType("array")
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
        .addProperty("inner", new ob.SchemaObjectBuilder("object", "Nested error we are wrapping (if any)")
            .build())
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
        .addProperty(pluralize(AUTHOR.toLowerCase()), authorsSchema())
        .addProperty(SERIES.toLowerCase(), seriesesSchema())
        .addProperty(pluralize(STORY.toLowerCase()), storiesSchema())
        .addProperty(pluralize(VOLUME.toLowerCase()), volumesSchema())
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
        .addProperty(pluralize(AUTHOR.toLowerCase()), authorsSchema())
        .addProperty(pluralize(STORY.toLowerCase()), storiesSchema())
        .build();
}

const seriesesSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(SERIES))
        .addType("array")
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
        .addProperty(pluralize(AUTHOR.toLowerCase()), authorsSchema())
        .addProperty(SERIES.toLowerCase(), seriesesSchema())
        .addProperty(pluralize(VOLUME.toLowerCase()), volumesSchema())
        .build();
}

const storiesSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(STORY))
        .addType("array")
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

const usersSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(USER))
        .addType("array")
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
        .addProperty(pluralize(AUTHOR.toLowerCase()), authorsSchema())
        .addProperty(pluralize(STORY.toLowerCase()), storiesSchema())
        .build();
}

const volumesSchema = (): ob.SchemaObject => {
    return new ob.SchemaObjectBuilder()
        .addItems(schemaRef(VOLUME))
        .addType("array")
        .build();
}

