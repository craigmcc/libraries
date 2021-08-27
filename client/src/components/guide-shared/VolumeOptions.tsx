// VolumeOptions -------------------------------------------------------------

// List Volumes that match search criteria, offering callbacks for adding,
// editing, or selecting a Volume.

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
import {HandleValue, HandleVolume, OnAction} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import useFetchVolumes from "../../hooks/useFetchVolumes";
import Author from "../../models/Author";
import Library from "../../models/Library";
import Story from "../../models/Story";
import {authorsKeys, listValue} from "../../util/transformations";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleAdd?: OnAction;               // Handle request to add a Volume (optional)
    handleEdit: HandleVolume;           // Handle request to edit a Volume
    handleSelect: HandleVolume;         // Handle request to select a Volume
    parent: Author | Library | Story;   // Parent object for requested Volumes
}

// Component Details ---------------------------------------------------------

const VolumeOptions = (props: Props) => {

    const libraryContext = useContext(LibraryContext);

    const [currentPage, setCurrentPage] = useState<number>(1);
    const [pageSize] = useState<number>(25);
    const [searchText, setSearchText] = useState<string>("");

    const [{volumes, error, loading}] = useFetchVolumes({
        currentPage: currentPage,
        library: libraryContext.state.library,
        parent: props.parent,
        pageSize: pageSize,
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
        <Container fluid id="VolumeOptions">

            <Row className="mb-3">
                <Col className="col-8">
                    <SearchBar
                        autoFocus
                        handleChange={handleChange}
                        label="Search For Volumes:"
                        placeholder="Search by all or part of name"
                    />
                </Col>
                <Col className="col-2">
                    <Pagination
                        currentPage={currentPage}
                        lastPage={(volumes.length === 0) ||
                            (volumes.length < pageSize)}
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
                        <th scope="col">Read</th>
                        <th scope="col">Location</th>
                        <th scope="col">Type</th>
                        <th scope="col">Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {(error) ? (
                        <tr>
                            <td className="text-center" rowSpan={6}>
                                Database Access Error: {error.message}
                            </td>
                        </tr>
                    ) : null}
                    {(loading) ? (
                        <tr>
                            <td className="text-center" rowSpan={6}>
                                Database Fetch In Progress
                            </td>
                        </tr>
                    ) : null}
                    {volumes.map((volume, rowIndex) => (
                        <tr
                            className="table-default"
                            key={1000 + (rowIndex * 100)}
                        >
                            <td key={1000 + (rowIndex * 100) + 1}
                                onClick={() => props.handleSelect(volume)}
                            >
                                {volume.name}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 2}>
                                {authorsKeys(volume.authors)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 3}>
                                {listValue(volume.active)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 4}>
                                {listValue(volume.read)}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 5}>
                                {volume.location}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 6}>
                                {volume.type}
                            </td>
                            <td key={1000 + (rowIndex * 100) + 99}>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleEdit(volume)}
                                    size="sm"
                                    type="button"
                                    variant="secondary"
                                >Edit</Button>
                                <Button
                                    className="mr-1"
                                    onClick={() => props.handleSelect(volume)}
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
