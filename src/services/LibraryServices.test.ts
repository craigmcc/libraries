// LibraryServices.test ------------------------------------------------------

// Functional tests for LibraryServices.

// External Modules ----------------------------------------------------------

import chai from "chai";
const expect = chai.expect;

// Internal Modules ----------------------------------------------------------

import {BadRequest, NotFound} from "../util/HttpErrors";
import * as SeedData from "../util/SeedData";
import {loadTestData} from "../util/TestUtils";
import LibraryServices from "./LibraryServices";

// Test Specifications ------------------------------------------------------

describe("LibraryServices Functional Tests", () => {

    // Test Hooks -----------------------------------------------------------

    beforeEach("#beforeEach", async () => {
        await loadTestData({
            withLibraries: true,
        });
    })

    // Test Methods ---------------------------------------------------------

    describe("exact()", () => {

        it("should fail on invalid name", async () => {

            const INVALID_NAME = "INVALID LIBRARY NAME";

            try {
                const result = await LibraryServices.exact(INVALID_NAME);
                expect.fail("Should have thrown NotFound");
            } catch (error) {
                if (error instanceof NotFound) {
                    expect(error.message).includes
                    (`Missing Library '${INVALID_NAME}'`);
                } else {
                    expect.fail(`Should have thrown NotFound, but threw '${error.message}'`);
                }
            }
        })

        it ("should pass on valid names", async () => {

            SeedData.LIBRARIES.forEach(async library => {
                try {
                    const name = library.name ? library.name : "foo";
                    const result = await LibraryServices.exact(name);
                    expect(result.name).equals(name);
                } catch (error) {
                    expect.fail(`Should not have thrown '${error.message}'`);
                }
            })

        })

    })

})

