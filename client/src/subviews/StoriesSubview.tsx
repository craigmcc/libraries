// StoriesSubview ------------------------------------------------------------

// Render a list of Stories for the currently selected Library, with a callback
// handler when a particular Story is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import AuthorClient from "../clients/AuthorClient";
import StoryClient from "../clients/StoryClient";
import VolumeClient from "../clients/VolumeClient";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import {
    HandleIndex,
    HandleStoryOptional,
    HandleValue,
    OnAction
} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import Author from "../models/Author";
import Story from "../models/Story";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {listValue} from "../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    base?: Author | Volume;             // Parent object to select or [Library]
    handleSelect: HandleStoryOptional;  // Handle Story selection or deselection
    nested?: boolean;                   // Show nested child list? [false]
    title?: string;                     // Table title [Stories for Library: XXXXX]
}

// Component Details ---------------------------------------------------------

const StoriesSubview = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [index, setIndex] = useState<number>(-1);
    const [nested] = useState<boolean>((props.nested !== undefined)
        ? props.nested : false);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [stories, setStories] = useState<Story[]>([]);
    const [title] = useState<string>((props.title !== undefined)
        ? props.title : `Stories for Library: ${libraryContext.state.library.name}`);

    useEffect(() => {

        const fetchStories = async () => {

            const libraryId = libraryContext.state.library.id;
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newStories: Story[] = [];
                try {
                    // TODO - cannot search by name on nested invocations
                    if (props.base instanceof Author) {
                        newStories =
                            await AuthorClient.stories(libraryId, props.base.id, {
                                limit: pageSize,
                            });
                    } else if (props.base instanceof Volume) {
                        newStories =
                            await VolumeClient.stories(libraryId, props.base.id, {
                                limit: pageSize,
                            });
                    } else if (searchText.length > 0) {
                        newStories =
                            await StoryClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1))
                            });
                    } else {
                        newStories =
                            await StoryClient.all(libraryId, {
                                limit: pageSize
                            });
                    }
                    logger.debug({
                        context: "StoriesSubview.fetchStories",
                        count: newStories.length,
//                        stories: newStories,
                        nested: nested,
                        title: title,
                    });
                    setIndex(-1);
                    setStories(newStories);
                } catch (error) {
                    setIndex(-1);
                    setStories([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "StoriesSubview.fetchStories",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("StoriesSubview.fetchStories", error);
                    }
                }
            } else {
                setIndex(-1);
                setStories([]);
                logger.debug({
                    context: "StoriesSubview.fetchStories",
                    msg: "SKIPPED",
                });
            }
        }

        fetchStories();

    }, [libraryContext, loginContext,
        currentPage, pageSize, searchText,
        props.base, nested, title]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "StoriesSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newStory = stories[newIndex];
            setIndex(newIndex);
            logger.info({
                context: "StoriesSubview.handleIndex",
                index: newIndex,
                volume: Abridgers.STORY(newStory),
            });
            if (props.handleSelect) {
                props.handleSelect(newStory);
            }
        }
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

        <Container fluid id="StoriesSubview">

            {(!nested) ? (
                <Row className="mb-3">
                    <Col className="col-10 mr-2">
                        <SearchBar
                            autoFocus
                            handleChange={handleChange}
                            label="Search For:"
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
            ) : null}


            <Row>
                <Table
                    bordered={true}
                    hover={true}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-dark">
                        <th
                            className="text-center"
                            colSpan={4}
                            key={101}
                        >
                            {props.title ? props.title : `Stories for Library: ${libraryContext.state.library.name}`}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Copyright</th>
                        <th scope="col">Notes</th>
                    </tr>
                    </thead>

                    <tbody>
                    {stories.map((story, rowIndex) => (
                        <tr
                            className={"table-" +
                                (rowIndex === index ? "primary" : "default")}
                            key={1000 + (rowIndex * 100)}
                            onClick={() => (handleIndex(rowIndex))}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {story.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(story.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(story.copyright)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {story.notes}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>

    )

}

export default StoriesSubview;
