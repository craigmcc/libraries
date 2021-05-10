// VolumeSummary -------------------------------------------------------------

// Render a summary of the currently selected Volume and its associated
// currently selected Authors and Stories (with their authors).

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import StoryClient from "../../clients/StoryClient";
import Author from "../../models/Author";
import Volume from "../../models/Volume";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import {HandleAction} from "../types";

// Incoming Properties ------------------------------------------------------

export interface Props {
    volume: Volume;                     // Currently selected Volume
}

// Component Details --------------------------------------------------------

const VolumeSummary = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [expand, setExpand] = useState<boolean>(true);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [storiesAuthors, setStoriesAuthors] = useState<string[]>([]);

    useEffect(() => {

        const fetchStoriesAuthors = async () => {
                if (loginContext.state.loggedIn && (libraryId > 0)) {
                    // For each Story, select the corresponding Authors
                    const storiesAuthors: string[] = [];
                    for (const story of props.volume.stories) {
                        const storyAuthors: Author[] = await StoryClient.authors(libraryId, story.id);
                        storiesAuthors.push(calculateAuthorsKeys(storyAuthors));
                    }
                    setStoriesAuthors(storiesAuthors);
                } else {
                    setStoriesAuthors([]);
                }
        }

        fetchStoriesAuthors();

    }, [libraryContext, loginContext, libraryId, props.volume]);

    const calculateAuthorsKeys = (authors: Author[]): string => {
        const keys: string[] = [];
        authors.forEach(author => {
            keys.push(`${author.last_name}, ${author.first_name}`);
        })
        return keys.join(" | ");
    }

    const toggleExpand: HandleAction = () => {
        setExpand(!expand);
    }

    return (
        <Container fluid id="VolumeSummary">

            <Row className="mb-1">
                <Col className="text-center">
                    <span>Summary for Volume:&nbsp;</span>
                    <span className="text-info">
                        {props.volume.name}&nbsp;&nbsp;
                    </span>
                    {(expand) ? (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-caret-up-square" viewBox="0 0 16 16"
                             onClick={toggleExpand}>
                            <path
                                d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                            <path
                                d="M3.544 10.705A.5.5 0 0 0 4 11h8a.5.5 0 0 0 .374-.832l-4-4.5a.5.5 0 0 0-.748 0l-4 4.5a.5.5 0 0 0-.082.537z"/>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                             className="bi bi-caret-down-square" viewBox="0 0 16 16"
                             onClick={toggleExpand}>
                            <path d="M3.626 6.832A.5.5 0 0 1 4 6h8a.5.5 0 0 1 .374.832l-4 4.5a.5.5 0 0 1-.748 0l-4-4.5z"/>
                            <path
                                d="M0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm15 0a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2z"/>
                        </svg>
                    )}
                </Col>
            </Row>

            {(expand) ? (
                <>
                    <Row className="mb-3">
                        <Col className="text-center">
                            <span>Volume Authors:&nbsp;</span>
                            <span className="text-info">
                        {calculateAuthorsKeys(props.volume.authors)}
                    </span>
                        </Col>
                    </Row>

                    <Row className="ml-1 mr-1">
                        <Table
                            bordered={true}
                            hover={false}
                            size="sm"
                            striped={false}
                        >

                            <thead>
                            <tr className="table-secondary">
                                <th scope="col">Included Stories</th>
                                <th scope="col">Story Authors</th>
                            </tr>
                            </thead>

                            <tbody>
                            {props.volume.stories.map((story, rowIndex) => (
                                <tr key={1000 + (rowIndex * 100)}>
                                    <td key={1000 + (rowIndex * 100) + 1}>
                                        {story.name}
                                    </td>
                                    <td key={1000 + (rowIndex * 100) + 2}>
                                        {storiesAuthors[rowIndex]}
                                    </td>
                                </tr>
                            ))}
                            </tbody>

                        </Table>
                    </Row>
                </>
                ) : null}

        </Container>
    )

}

export default VolumeSummary;
