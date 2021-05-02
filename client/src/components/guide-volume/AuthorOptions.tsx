// AuthorOptions -------------------------------------------------------------

// List Authors that match search criteria, offering callbacks for adding,
// editing, including (marking this Author as creator of this Volume),
// or excluding (marking this AUthor as not a creator of this Volume).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleAuthor, HandleValue, OnAction} from "../types";
import AuthorClient from "../../clients/AuthorClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";
import Table from "react-bootstrap/Table";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleEdit: HandleAuthor;           // Handle request to edit an Author
    handleExclude: HandleAuthor;        // Handle request to exclude an Author
    handleInclude: HandleAuthor;        // Handle request to include an Author
    included: (author: Author) => boolean;
                                        // Is the specified Author included?
}

// Component Details ---------------------------------------------------------

const AuthorOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [authors, setAuthors] = useState<Author[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    useEffect(() => {

        const fetchAuthors = async () => {

            // Fetch matching or first N volumes
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newAuthors: Author[] = [];
                try {
                    if (searchText.length > 0) {
                        newAuthors =
                            await AuthorClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                    } else {
                        newAuthors =
                            await AuthorClient.all(libraryId, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                    }
                    setAuthors(newAuthors);
                } catch (error) {
                    setAuthors([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "AuthorOptions.fetchAuthors",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("VolumeGuideVolume.fetchVolumes", error);
                    }

                }
            } else {
                setAuthors([]);
                logger.debug({
                    context: "AuthorOptions.fetchAuthors",
                    msg: "SKIPPED",
                });
            }

        }

        fetchAuthors();

    }, [libraryContext, loginContext, props,
        currentPage, libraryId, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const onNext: OnAction = () => {
        const newCurrentPage = currentPage + 1;
        setCurrentPage(newCurrentPage);
    }

    const onPrevious: OnAction = () => {
        const newCurrentPage = currentPage - 1;
        setCurrentPage(newCurrentPage);
    }

    return (
        <Container fluid id="AuthorOptions">

            <Row className="mb-3">
                <Col className="col-10 mr-2">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Authors:"
                        placeholder="Search by all or part of either name"
                    />
                </Col>
                <Col>
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(authors.length === 0) ||
                            (authors.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                    />
                </Col>
            </Row>

            <Row className="ml-1 mr-1">
                <Table
                    bordered={true}
                    hover={false}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {authors.map((author, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {author.first_name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {author.last_name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(author.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {author.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(authors[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    disabled={props.included(authors[rowIndex])}
                                    onClick={() => props.handleInclude(authors[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Include</Button>
                                <Button
                                    className="mr-1"
                                    disabled={!props.included(authors[rowIndex])}
                                    onClick={() => props.handleExclude(authors[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Exclude</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>
    )

}

export default AuthorOptions;
