// WriterOptions -------------------------------------------------------------

// List Writers (Authors of a Story) that match search criteria, offering
// callbacks for adding, editing, including (marking this Writer as creator
// of this Story), or excluding (marking this Writer as not a creator of
// this Story).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleAuthor, HandleValue, OnAction} from "../types";
import AuthorClient from "../../clients/AuthorClient";
import StoryClient from "../../clients/StoryClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Writer (optional)
    handleEdit: HandleAuthor;           // Handle request to edit a Writer
    handleExclude: HandleAuthor;        // Handle request to exclude a Writer
    handleInclude: HandleAuthor;        // Handle request to include a Writer
    included: (writer: Author) => boolean; // Is the specified Author included?
    story: Story;                       // Currently selected Story
}

// Component Details ---------------------------------------------------------

const WriterOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [writers, setWriters] = useState<Author[]>([]);

    useEffect(() => {

        const fetchWriters = async () => {

            // Fetch matching (search text) or included (no search text) Authors
            if (loginContext.state.loggedIn && (libraryId > 0) && (props.story.id > 0)) {
                let newWriters: Author[] = [];
                try {
                    if (searchText.length > 0) {
                        // Fetch all Library Authors matching searchText
                        newWriters =
                            await AuthorClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                        logger.debug({
                            context: "WriterOptions.fetchWriters",
                            msg: "Select by searchText",
                            searchText: searchText,
                            writers: newWriters,
                        });
                    } else {
                        // Fetch only Authors included in the current Story
                        newWriters =
                            await StoryClient.authors(libraryId, props.story.id);
                        logger.debug({
                            context: "WriterOptions.fetchWriters",
                            msg: "Select by included",
                            searchText: searchText,
                            writers: newWriters,
                        });
                    }
                    setWriters(newWriters);
                } catch (error) {
                    setWriters([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "WriterOptions.fetchWriters",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("WriterOptions.fetchWriters", error);
                    }

                }
            } else {
                setWriters([]);
                logger.debug({
                    context: "WriterOptions.fetchWriters",
                    msg: "SKIPPED",
                });
            }

        }

        fetchWriters();

    }, [libraryContext.state.library.id, loginContext.state.loggedIn, props.story,
        currentPage, libraryId, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleExclude: HandleAuthor = (writer) => {
        props.handleExclude(writer);
    }

    const handleInclude: HandleAuthor = (writer) => {
        props.handleInclude(writer);
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
        <Container fluid id="WriterOptions">

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        initialValue={searchText}
                        label="Search For Writers:"
                        placeholder="Search by all or part of either name"
                    />
                </Col>
                <Col className="col-2">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(writers.length === 0) ||
                        (writers.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        variant="secondary"
                    />
                </Col>
                {(props.handleAdd) ? (
                    <Col className="col-2">
                        <Button
                            onClick={props.handleAdd}
                            size="sm"
                            variant="primary"
                        >Add</Button>
                    </Col>
                ) : null }
            </Row>

            <Row className="ml-1 mr-1">
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Principal</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {writers.map((writer, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {writer.first_name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {writer.last_name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(writer.principal)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(writer.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {writer.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(writers[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    disabled={props.included(writers[rowIndex])}
                                    onClick={() => handleInclude(writers[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Include</Button>
                                <Button
                                    className="mr-1"
                                    disabled={!props.included(writers[rowIndex])}
                                    onClick={() => handleExclude(writers[rowIndex])}
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

export default WriterOptions;
