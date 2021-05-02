// VolumeOptions -------------------------------------------------------------

// List Volumes that match search criteria, offering callbacks for adding,
// editing, or selecting a Volume.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import Pagination from "../Pagination";
import SearchBar from "../SearchBar";
import {HandleValue, HandleVolume, OnAction} from "../types";
import VolumeClient from "../../clients/VolumeClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Volume from "../../models/Volume";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";
import Table from "react-bootstrap/Table";
import {listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleEdit: HandleVolume;           // Handle request to edit a Volume
    handleSelect: HandleVolume;         // Handle request to select a Volume
}

// Component Details ---------------------------------------------------------

const VolumeOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [currentPage, setCurrentPage] = useState(1);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");
    const [volumes, setVolumes] = useState<Volume[]>([]);

    useEffect(() => {

        const fetchVolumes = async () => {

            // Fetch matching or first N volumes
            // TODO - deal with previously selected volume (but only the first time)
            if (loginContext.state.loggedIn && (libraryId > 0)) {
                let newVolumes: Volume[] = [];
                try {
                    if (searchText.length > 0) {
                        newVolumes =
                            await VolumeClient.name(libraryId, searchText, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                    } else {
                        newVolumes =
                            await VolumeClient.all(libraryId, {
                                limit: pageSize,
                                offset: (pageSize * (currentPage - 1)),
                            });
                    }
                    setVolumes(newVolumes);
                } catch (error) {
                    setVolumes([]);
                    if (error.response && (error.response.status === 403)) {
                        logger.debug({
                            context: "VolumeGuideVolume.fetchVolumes",
                            msg: "FORBIDDEN",
                        });
                    } else {
                        ReportError("VolumeGuideVolume.fetchVolumes", error);
                    }

                }
            } else {
                setVolumes([]);
                logger.debug({
                    context: "VolumeGuideVolume.fetchVolumes",
                    msg: "SKIPPED",
                });
            }

        }

        fetchVolumes();

    }, [libraryContext, loginContext, props,
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
        <Container fluid id="VolumeOptions">

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
                    hover={false}
                    size="sm"
                    striped={true}
                >

                    <thead>
                    <tr className="table-secondary">
                        <th scope="col">Name</th>
                        <th scope="col">Active</th>
                        <th scope="col">Read</th>
                        <th scope="col">Location</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {volumes.map((volume, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
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
                                {volume.location}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(volumes[rowIndex])}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    onClick={() => props.handleSelect(volumes[rowIndex])}
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

export default VolumeOptions;
