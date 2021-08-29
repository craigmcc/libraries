// StoryOptions --------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, or selecting a detailed stage for a Story.

// External Modules ----------------------------------------------------------

import React, {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleStory, HandleValue, OnAction} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchStories from "../../hooks/useFetchStories";
import {authorsKeys, listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Story (optional)
    handleEdit: HandleStory;            // Handle request to edit a Story
    handleAuthors: HandleStory;         // Handle request to manage Authors for a Story
    handleSeries: HandleStory;          // Handle request to manage Series for a Story
    handleVolumes: HandleStory;         // Handle request to manage Volumes for a Story
}

// Component Details ---------------------------------------------------------

const StoryOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const [{stories/*, error, loading*/}] = useFetchStories({
        currentPage: currentPage,
        library: libraryContext.state.library,
        parent: libraryContext.state.library,
        pageSize: pageSize,
        searchText: searchText,
    });

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
        <Container fluid id="StoryOptions">

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Stories:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col className="col-2">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(stories.length === 0) ||
                            (stories.length < pageSize)}
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
                        <th scope="col">Name</th>
                        <th scope="col">Writers</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {stories.map((story, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {story.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsKeys(story.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {story.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(story)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleAuthors(story)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Authors</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSeries(story)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Series</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleVolumes(story)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Volumes</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>
    )

}

export default StoryOptions;
