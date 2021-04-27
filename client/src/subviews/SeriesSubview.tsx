// SeriesSubview ------------------------------------------------------------

// Render a list of Series for the currently selected Library, with a callback
// handler when a particular Series is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import SeriesClient from "../clients/SeriesClient";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import {
    HandleIndex,
    HandleSeriesOptional,
    HandleValue,
    OnAction
} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import Series from "../models/Series";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {listValue} from "../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleSeriesOptional; // Handle Series selection or deselection
    title?: string;                     // Table title [Series for Library XXXXX]
}

// Component Details ---------------------------------------------------------

const SeriesSubview = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [index, setIndex] = useState<number>(-1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [series, setSeries] = useState<Series[]>([]);

    useEffect(() => {

        const fetchSeries = async () => {

            const libraryId = libraryContext.state.library.id;
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newSeries: Series[] = [];
                try {
                    if (searchText.length > 0) {
                        newSeries =
                            await SeriesClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1))
                            });
                    } else {
                        newSeries =
                            await SeriesClient.all(libraryId, {
                                limit: pageSize
                            });
                    }
                    logger.debug({
                        context: "SeriesSubview.fetchSeries",
                        count: newSeries.length,
//                        series: newSeries,
                    });
                    setIndex(-1);
                    setSeries(newSeries);
                } catch (error) {
                    setIndex(-1);
                    setSeries([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "SeriesSubview.fetchSeries",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("SeriesSubview.fetchSeries", error);
                    }
                }
            } else {
                setIndex(-1);
                setSeries([]);
                logger.debug({
                    context: "SeriesSubview.fetchSeries",
                    msg: "SKIPPED",
                });
            }
        }

        fetchSeries();

    }, [libraryContext, loginContext, currentPage, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "SeriesSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newSeries = series[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "SeriesSubview.handleIndex",
                index: newIndex,
                volume: Abridgers.STORY(newSeries),
            });
            if (props.handleSelect) {
                props.handleSelect(newSeries);
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

        <Container fluid id="SeriesSubview">

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
                        lastPage={(series.length === 0) ||
                        (series.length < pageSize)}
                        onNext={onNext}
                        onPrevious={onPrevious}
                    />
                </Col>
            </Row>

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
                            {props.title ? props.title : `Series for Library: ${libraryContext.state.library.name}`}
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
                    {series.map((series, rowIndex) => (
                        <tr
                            className={"table-" +
                                (rowIndex === index ? "primary" : "default")}
                            key={1000 + (rowIndex * 100)}
                            onClick={() => (handleIndex(rowIndex))}
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
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>

    )

}

export default SeriesSubview;
