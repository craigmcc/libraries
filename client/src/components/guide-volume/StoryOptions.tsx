// StoryOptions --------------------------------------------------------------

// List Stories that match search criteria, offering callbacks for adding,
// editing, including (marking this Story as part of this Volume), or
// excluding (marking this Story as not part of this Volume).

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
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleEdit: HandleStory;            // Handle request to edit this Story
    handleExclude: HandleStory;         // Handle request to exclude a Story
    handleInclude: HandleStory;         // Handle request to include a Story
    handleInsert: HandleStory;          // Handle request to insert a Story
    included: (story: Story) => boolean;
                                        // Is the specified Story included?
    stories: Story[];                   // Included Stories for this Volume
    volume: Volume;                     // Currently selected Volume
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
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newStories: Story[] = [];
                try {
                    if (searchText.length > 0) {

                        // Find matching Stories
                        newStories =
                            await StoryClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });

                    } else {

                        // Find currently included Stories
                        newStories =
                            await VolumeClient.stories(libraryId, props.volume.id);

                        // If there are no included Stories for a Volume
                        // of type "Single", create one based on the
                        // name and Authors of the owning Volume
                        if ((props.volume.type === "Single") && (newStories.length === 0)) {

                            // Create and insert the new Story
                            const added = new Story({
                                active: true,
                                copyright: props.volume.copyright ? props.volume.copyright : undefined,
                                library_id: props.volume.library_id,
                                name: props.volume.name,
                            })
                            await props.handleInsert(added);

                            // Reselect to pick up the newly added story
                            newStories =
                                await VolumeClient.stories(libraryId, props.volume.id);

                        }

                    }
                    setStories(newStories);
                } catch (error) {
                    setStories([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "StoryOptions.fetchStory",
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

    }, [libraryContext, loginContext, props,
        currentPage, libraryId, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleExclude: HandleStory = (story) => {
        setSearchText("");
        props.handleExclude(story);
    }

    const handleInclude: HandleStory = (story) => {
        setSearchText("");
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
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
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
