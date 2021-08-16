// OpenApiView ---------------------------------------------------------------

// Swagger UI view of the OpenAPI Documentation for this application.

// External Modules ----------------------------------------------------------

import React from "react";
import Container from "react-bootstrap/Container";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";

// Internal Modules ---------------------------------------------------------

// Component Details --------------------------------------------------------

const OpenApiView = () => {

    const URL = "/openapi.json";

    return (
        <Container fluid id="OpenApiView">
            <SwaggerUI url={URL}/>
        </Container>
    )

}

export default OpenApiView;
