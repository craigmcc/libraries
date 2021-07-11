// SeriesOptions -------------------------------------------------------------

// List Series that match search criteria, offering callbacks for adding,
// editing, or selecting a Series.

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
import {HandleSeries, HandleValue, OnAction} from "../types";
import SeriesClient from "../../clients/SeriesClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Series (optional)
    handleEdit: HandleSeries;           // Handle request to edit a Series
    handleSelect: HandleSeries;         // Handle request to select a Series
}

// Component Details ---------------------------------------------------------

const SeriesOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    // Gotta love English pluralization rules sometimes
    const [serieses, setSerieses] = useState<Series[]>([]);

    useEffect(() => {

        const fetchSerieses = async () => {

            // Fetch matching or first N series
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newSerieses: Series[] = [];
                try {
                    if (searchText.length > 0) {
                        newSerieses =
                            await SeriesClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                        logger.debug({
                            context: "SeriesOptions.fetchSerieses",
                            msg: "Select by searchText",
                            searchText: searchText,
                            series: newSerieses,
                        });
                    } else {
                        newSerieses =
                            await SeriesClient.all(libraryId, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                        logger.debug({
                            context: "SeriesOptions.fetchSerieses",
                            msg: "Select by library",
                            series: newSerieses,
                        });
                    }
                    setSerieses(newSerieses);
                } catch (error) {
                    setSerieses([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "SeriesOptions.fetchSerieses",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("SeriesOptions.fetchSerieses", error);
                    }
                }
            } else {
                setSerieses([]);
                logger.debug({
                    context: "SeriesOptions.fetchSerieses",
                    msg: "SKIPPED",
                });
            }

        }

        fetchSerieses();

    }, [libraryContext.state.library.id, loginContext.state.loggedIn,
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
                    hover={false}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Copyright</th>
                        <th scope="col">Notes</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {serieses.map((series, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {series.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(series.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(series.copyright)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {series.notes}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(serieses[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSelect(serieses[rowIndex])}
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
