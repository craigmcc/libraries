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
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";

// Incoming Properties ------------------------------------------------------

export interface Props {
    authors: Author[];                  // Currently included Authors
    stories: Story[];                   // Currently included Stories
    volume: Volume;                     // Currently selected Volume
}

// Component Details --------------------------------------------------------

const VolumeSummary = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [storiesAuthors, setStoriesAuthors] = useState<string[]>([]);

    useEffect(() => {

        const fetchStoriesAuthors = async () => {
                if (loginContext.state.loggedIn && (libraryId > 0)) {
                    // For each Story, select the corresponding Authors
                    const newStoriesAuthors: string[] = [];
                    for (const story of props.stories) {
                        const storyAuthors: Author[] = await StoryClient.authors(libraryId, story.id);
                        newStoriesAuthors.push(calculateAuthorsKeys(storyAuthors));
                    }
                    setStoriesAuthors(newStoriesAuthors);
                } else {
                    setStoriesAuthors([]);
                }
        }

        fetchStoriesAuthors();

    }, [libraryContext, loginContext, libraryId, props.stories]);

    const calculateAuthorsKeys = (authors: Author[]): string => {
        const keys: string[] = [];
        authors.forEach(author => {
            keys.push(`${author.last_name}, ${author.first_name}`);
        })
        return keys.join(" | ");
    }

    return (
        <Container fluid id="VolumeSummary">

            <Row className="mb-1">
                <Col className="text-center">
                    <span>Summary for Volume:&nbsp;</span>
                    <span className="text-info">
                        {props.volume.name}
                    </span>
                </Col>
            </Row>

            <Row className="mb-3">
                <Col className="text-center">
                    <span>Volume Authors:&nbsp;</span>
                    <span className="text-info">
                        {calculateAuthorsKeys(props.authors)}
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
                    {props.stories.map((story, rowIndex) => (
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

        </Container>
    )

}

export default VolumeSummary;
