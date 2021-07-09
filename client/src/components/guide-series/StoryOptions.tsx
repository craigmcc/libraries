// StoryOptions --------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, including (marking this Story as part of this Series), or
// excluding (marking this Story as not part of this Series).

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
import {HandleStory, HandleValue, OnAction} from "../types";
import StoryClient from "../../clients/StoryClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import Story from "../../models/Story";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleEdit: HandleStory;            // Handle request to edit this Story
    handleExclude: HandleStory;         // Handle request to exclude a Story
    handleInclude: HandleStory;         // Handle request to include a Story
    handleInsert: HandleStory;          // Handle request to insert a Story
    handleSelect: HandleStory;          // Handle request to select a Story
    included: (story: Story) => boolean; // Is the specified Story included?
    series: Series;                     // Currently selected Series
}

// Component Details ---------------------------------------------------------

const StoryOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [stories, setStories] = useState<Story[]>([]);

    useEffect(() => {

        const fetchStories = async () => {

            // Fetch matching (search text) or included (no search text) Stories
            if (loginContext.state.loggedIn && (libraryId > 0) && (props.series.id > 0)) {
                let newStories: Story[] = [];
                try {
                    if (searchText.length > 0) {

                        // Fetch matching Stories
                        newStories =
                            await StoryClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                        logger.debug({
                            context: "StoryOptions.fetchStories",
                            msg: "Select by searchText",
                            searchText: searchText,
                            stories: newStories,
                        });

                    } else {

                        // Fetch currently included Stories
                        newStories = props.series.stories;

                    }
                    setStories(newStories);

                } catch (error) {
                    setStories([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "StoryOptions.fetchStories",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("StoryOptions.fetchStories", error);
                    }
                }
            } else {
                setStories([]);
                logger.debug({
                    context: "StoryOptions.fetchStories",
                    msg: "SKIPPED",
                });
            }

        }

        fetchStories();

    }, [loginContext.state.loggedIn, props.series,
        currentPage, libraryId, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleExclude: HandleStory = (story) => {
        props.handleExclude(story);
    }

    const handleInclude: HandleStory = (story) => {
        props.handleInclude(story);
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
                <Col className="col-10 mr-2">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        initialValue={searchText}
                        label="Search For Stories:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col>
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(stories.length === 0) ||
                            (stories.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                        variant="secondary"
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
                        <th scope="col">Name</th>
                        <th scope="col">Ordinal</th>
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
                                {story.ordinal}
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
                                    onClick={() => props.handleEdit(stories[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    disabled={props.included(stories[rowIndex])}
                                    onClick={() => handleInclude(stories[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Include</Button>
                                <Button
                                    className="mr-1"
                                    disabled={!props.included(stories[rowIndex])}
                                    onClick={() => handleExclude(stories[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Exclude</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSelect(stories[rowIndex])}
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