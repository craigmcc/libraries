// SeriesOptions -------------------------------------------------------------

// List Series that match search criteria, offering callbacks for adding,
// editing, or selecting a Series.

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
import {HandleSeries, HandleValue, OnAction} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchSerieses from "../../hooks/useFetchSerieses";
import {authorsKeys, listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Series (optional)
    handleEdit: HandleSeries;           // Handle request to edit a Series
    handleSelect: HandleSeries;         // Handle request to select a Series
}

// Component Details ---------------------------------------------------------

const SeriesOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const [{serieses, error, loading}] = useFetchSerieses({
        currentPage: currentPage,
        library: libraryContext.state.library,
        pageSize: pageSize,
        parent: libraryContext.state.library,
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
        <Container fluid id="SeriesOptions">

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Series:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col className="col-2">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(serieses.length === 0) ||
                            (serieses.length < pageSize)}
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
                        <th scope="col">Authors</th>
                        <th scope="col">Active</th>
                        <th scope="col">Copyright</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {(error) ? (
                        <tr>
                            <td className="text-center" rowSpan={5}>
                                Database Access Error: {error.message}
                            </td>
                        </tr>
                    ) : null}
                    {(loading) ? (
                        <tr>
                            <td className="text-center" rowSpan={5}>
                                Database Fetch In Progress
                            </td>
                        </tr>
                    ) : null}
                    {serieses.map((series, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}
                                onClick={() => props.handleSelect(series)}
                            >
                                {series.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsKeys(series.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(series.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(series.copyright)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {series.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(series)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSelect(series)}
                                    size="sm"
                                    type="button"
                                    variant="primary"
                                >Select</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>
    )

}

export default SeriesOptions;
