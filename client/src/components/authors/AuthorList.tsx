// AuthorList ----------------------------------------------------------------

// Render a list of Authors for the currently selected Library, with a callback
// handler when a particular Author is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {
    HandleIndex,
    HandleAuthorOptional,
    HandleValue,
    OnAction
} from "../types";
import AuthorClient from "../../clients/AuthorClient";
import SeriesClient from "../../clients/SeriesClient";
import StoryClient from "../../clients/StoryClient";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    base?: Series | Story | Volume;     // Parent object to select for [Library]
    handleSelect: HandleAuthorOptional; // Handle Author selection or deselection
    nested?: boolean;                   // Show nested child list? [false]
    title?: string;                     // Table title [Authors for Library: XXXXX]
}

// Component Details ---------------------------------------------------------

const AuthorList = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [authors, setAuthors] = useState<Author[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [index, setIndex] = useState<number>(-1);
    const [nested] = useState<boolean>((props.nested !== undefined)
        ? props.nested : false);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [title] = useState<string>((props.title !== undefined)
        ? props.title : `Authors for Library: ${libraryContext.state.library.name}`);

    useEffect(() => {

        const fetchAuthors = async () => {

            const libraryId = libraryContext.state.library.id;
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newAuthors: Author[] = [];
                try {
                    // TODO - cannot search by name on nested invocations
                    if (props.base instanceof Series) {
                        newAuthors =
                            await SeriesClient.authors(libraryId, props.base.id, {
                                limit: pageSize,
                            });
                    } else if (props.base instanceof Story) {
                        newAuthors =
                            await StoryClient.authors(libraryId, props.base.id, {
                                limit: pageSize,
                            });
                    } else if (props.base instanceof Volume) {
                        newAuthors =
                            await VolumeClient.authors(libraryId, props.base.id, {
                                limit: pageSize,
                            });
                    } else if (searchText.length > 0) {
                        newAuthors =
                            await AuthorClient.all(libraryId, {
                                limit: pageSize,
                                name: searchText,
                                offset: (pageSize * (currentPage - 1))
                            });
                    } else {
                        newAuthors =
                            await AuthorClient.all(libraryId, {
                                limit: pageSize
                            });
                    }
                    logger.info({
                        context: "AuthorsSubview.fetchAuthors",
                        count: newAuthors.length,
//                        authors: newAuthors,
                        base: props.base,
                        nested: nested,
                        title: title,
                    });
                    setAuthors(newAuthors);
                    setIndex(-1);
                } catch (error) {
                    setAuthors([]);
                    setIndex(-1);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "AuthorsSubview.fetchAuthors",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("AuthorsSubview.fetchAuthors", error);
                    }
                }
            } else {
                setAuthors([]);
                setIndex(-1);
                logger.debug({
                    context: "AuthorsSubview.fetchAuthors",
                    msg: "SKIPPED",
                });
            }
        }

        fetchAuthors();

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
                context: "AuthorsSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newAuthor = authors[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "AuthorsSubview.handleIndex",
                index: newIndex,
                author: Abridgers.AUTHOR(newAuthor),
            });
            if (props.handleSelect) {
                props.handleSelect(newAuthor);
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

        <Container fluid id="AuthorsSubview">

            {(!nested) ? (
                <Row className="mb-3">
                    <Col className="col-10 mr-2">
                        <SearchBar
                            autoFocus
                            handleChange={handleChange}
                            label="Search For:"
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
            ) : null }

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
                            {title}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">First Name</th>
                        <th scope="col">Last Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Notes</th>
                    </tr>
                    </thead>

                    <tbody>
                    {authors.map((author, rowIndex) => (
                        <tr
                            className={"table-" +
                                (rowIndex === index ? "primary" : "default")}
                            key={1000 + (rowIndex * 100)}
                            onClick={() => (handleIndex(rowIndex))}
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
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>

    )

}

export default AuthorList;
