// StoryOptions --------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, including (marking this Story as part of this Series/Volume), or
// excluding (marking this Story as not part of this Series/Volume).

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
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import {authorsKeys, listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Story (optional)
    handleEdit: HandleStory;            // Handle request to edit this Story
    handleExclude: HandleStory;         // Handle request to exclude a Story
    handleInclude: HandleStory;         // Handle request to include a Story
    handleSelect: HandleStory;          // Handle request to select a Story
    included: (story: Story) => boolean; // Is the specified Story included?
    parent: Series | Volume;            // Currently selected Series
}

// Component Details ---------------------------------------------------------

const StoryOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const [{stories/*, error, loading*/}] = useFetchStories({ // TODO error/loading
        currentPage: currentPage,
        library: libraryContext.state.library,
        pageSize: pageSize,
        parent: props.parent,
        searchText: searchText,
    });

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleExclude: HandleStory = (story) => {
        props.handleExclude(story);
        setSearchText("");
    }

    const handleInclude: HandleStory = (story) => {
        props.handleInclude(story);
        setSearchText("");
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
                        initialValue={searchText}
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
                        {(props.parent instanceof Series) ? (
                            <th scope="col">Ordinal</th>
                        ) : null }
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
                            {(props.parent instanceof Series) ? (
                                <td key={1000 + (rowIndex * 100) + 2}>
                                    {story.ordinal}
                                </td>
                            ) : null }
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {authorsKeys(story.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
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
                                    disabled={props.included(story)}
                                    onClick={() => handleInclude(story)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Include</Button>
                                <Button
                                    className="mr-1"
                                    disabled={!props.included(story)}
                                    onClick={() => handleExclude(story)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Exclude</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSelect(story)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Writers</Button>
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
