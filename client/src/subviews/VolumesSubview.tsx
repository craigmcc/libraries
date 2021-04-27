// VolumesSubview ------------------------------------------------------------

// Render a list of Volumes for the currently selected Library, with a callback
// handler when a particular Volume is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import VolumeClient from "../clients/VolumeClient";
import Pagination from "../components/Pagination";
import SearchBar from "../components/SearchBar";
import {
    HandleIndex,
    HandleVolumeOptional,
    HandleValue,
    OnAction
} from "../components/types";
import LibraryContext from "../contexts/LibraryContext";
import LoginContext from "../contexts/LoginContext";
import Volume from "../models/Volume";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";
import {listValue} from "../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleVolumeOptional; // Handle Volume selection or deselection
    title?: string;                     // Table title [Volumes for Library XXXXX]
}

// Component Details ---------------------------------------------------------

const VolumesSubview = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [index, setIndex] = useState<number>(-1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {

        const fetchVolumes = async () => {

            const libraryId = libraryContext.state.library.id;
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newVolumes: Volume[] = [];
                try {
                    if (searchText.length > 0) {
                        newVolumes =
                            await VolumeClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1))
                            });
                    } else {
                        newVolumes =
                            await VolumeClient.all(libraryId, {
                                limit: pageSize
                            });
                    }
                    logger.debug({
                        context: "VolumesSubview.fetchVolumes",
                        count: newVolumes.length,
//                        volumes: newVolumes,
                    });
                    setIndex(-1);
                    setVolumes(newVolumes);
                } catch (error) {
                    setIndex(-1);
                    setVolumes([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "VolumesSubview.fetchVolumes",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("VolumesSubview.fetchVolumes", error);
                    }
                }
            } else {
                setIndex(-1);
                setVolumes([]);
                logger.debug({
                    context: "VolumesSubview.fetchVolumes",
                    msg: "SKIPPED",
                });
            }
        }

        fetchVolumes();

    }, [libraryContext, loginContext, currentPage, pageSize, searchText]);

    const handleChange: HandleValue = (newSearchText) => {
        setSearchText(newSearchText);
    }

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "VolumesSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newVolume = volumes[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "VolumesSubview.handleIndex",
                index: newIndex,
                volume: Abridgers.VOLUME(newVolume),
            });
            if (props.handleSelect) {
                props.handleSelect(newVolume);
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

        <Container fluid id="VolumesSubview">

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
                        lastPage={(volumes.length === 0) ||
                        (volumes.length < pageSize)}
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
                            colSpan={6}
                            key={101}
                        >
                            {props.title ? props.title : `Volumes for Library: ${libraryContext.state.library.name}`}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Read</th>
                        <th scope="col">Copyright</th>
                        <th scope="col">Location</th>
                        <th scope="col">Notes</th>
                    </tr>
                    </thead>

                    <tbody>
                    {volumes.map((volume, rowIndex) => (
                        <tr
                            className={"table-" +
                               (rowIndex === index ? "primary" : "default")}
                            key={1000 + (rowIndex * 100)}
                            onClick={() => (handleIndex(rowIndex))}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}>
                                {volume.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {listValue(volume.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(volume.read)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {volume.copyright}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {volume.location}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {volume.notes}
                            </td>
                        </tr>
                    ))}
                    </tbody>

                </Table>
            </Row>

        </Container>

    )

}

export default VolumesSubview;
