// AuthorOptions -------------------------------------------------------------

// List Authors that match search criteria, offering callbacks for adding,
// editing, including (marking this Author as creator of this Series),
// or excluding (marking this Author as not a creator of this Series).

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
import {HandleAuthor, HandleValue, OnAction} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchAuthors from "../../hooks/useFetchAuthors";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add an Author (optional)
    handleEdit: HandleAuthor;           // Handle request to edit an Author
    handleExclude: HandleAuthor;        // Handle request to exclude an Author
    handleInclude: HandleAuthor;        // Handle request to include an Author
    included: (author: Author) => boolean; // Is the specified Author included?
    parent: Series | Story | Volume;    // Currently selected Series/Story/Volume
}

// Component Details ---------------------------------------------------------

const AuthorOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const [{authors/*, error, loading*/}] = useFetchAuthors({ // TODO error/loading
        currentPage: currentPage,
        library: libraryContext.state.library,
        pageSize: pageSize,
        parent: props.parent,
        searchText: searchText,
    });

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleExclude: HandleAuthor = (author) => {
        props.handleExclude(author);
        setSearchText("");
    }

    const handleInclude: HandleAuthor = (author) => {
        props.handleInclude(author);
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
        <Container fluid id="AuthorOptions">

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        initialValue={searchText}
                        label="Search For Authors:"
                        placeholder="Search by all or part of either name"
                    />
                </Col>
                <Col className="col-2">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(authors.length === 0) ||
                        (authors.length < pageSize)}
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
                                {listValue(author.principal)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(author.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {author.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(author)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    disabled={props.included(author)}
                                    onClick={() => handleInclude(author)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Include</Button>
                                <Button
                                    className="mr-1"
                                    disabled={!props.included(author)}
                                    onClick={() => handleExclude(author)}
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
