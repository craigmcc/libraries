// StageSerieses -------------------------------------------------------------

// Select Series(es) for the currently selected Author/Story, while offering
// the option to edit existing Series or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import {HandleStage, Stage} from "./Stage";
import SeriesOptions from "./SeriesOptions";
import {HandleAction, HandleSeries, OnAction, Scopes} from "../types";
import SeriesForm from "../series/SeriesForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateSeries from "../../hooks/useMutateSeries";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import Volume from "../../models/Volume";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleSeries: HandleSeries;         // Handle selecting a Series
    handleStage: HandleStage;           // Handle changing guide stage
    parent: Author | Story;             // Currently selected Author or Story
}

// Component Details ---------------------------------------------------------

const StageSerieses = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [series, setSeries] = useState<Series | null>(null);

    const [{performExclude, performInclude, performInsert, performRemove,
        performUpdate/*, error, processing*/}] = useMutateSeries({
        library: libraryContext.state.library,
        parent: props.parent,
    });

    useEffect(() => {

        logger.info({
            context: "StageSerieses.useEffect",
            parent: Abridgers.ANY(props.parent),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.parent]);

    const handleAdd: OnAction = () => {
        const theSeries = new Volume({
            library_id: libraryId,
        });
        logger.debug({
            context: "StageSerieses.handleAdd",
            volume: theSeries,
        });
        setSeries(theSeries);
    }

    const handleEdit: HandleSeries = async (theSeries) => {
        logger.debug({
            context: "StageSerieses.handleEdit",
            volume: Abridgers.SERIES(theSeries),
        })
        setSeries(theSeries);
    }

    const handleExclude: HandleSeries = async (theSeries) => {
        await performExclude(theSeries);
        props.handleRefresh();
    }

    const handleInclude: HandleSeries = async (theSeries) => {
        await performInclude(theSeries);
        props.handleRefresh();
    }

    const handleInsert: HandleSeries = async (theSeries) => {
        const inserted = await performInsert(theSeries);
        await performInclude(inserted); // Assume new Series is included
        setSeries(null);
        props.handleRefresh();
    }

    const handlePrevious = (): void => {
        props.handleStage(Stage.PARENT);
    }

    const handleRemove: HandleSeries = async (theSeries) => {
        await performRemove(theSeries);
        setSeries(null);
        props.handleRefresh();
    }

    const handleSelect: HandleSeries = async (theSeries) => {
        logger.debug({
            context: "StageSerieses.handleSelect",
            volume: theSeries,
        });
        props.handleSeries(theSeries);
        // props.handleStage(???) - Nothing to do here???
        // props.handleRefresh()
    }

    const handleUpdate: HandleSeries = async (theSeries) => {
        await performUpdate(theSeries);
        setSeries(theSeries);
        props.handleRefresh();
    }

    // Is the specified Series currently included for this Author/Story?
    const included = (theSeries: Series): boolean => {
        let result = false;
        props.parent.series.forEach(includedSeries => {
            if (theSeries.id === includedSeries.id) {
                result = true;
            }
        });
        return result;
    }

    return (
        <Container fluid id="StageSerieses">

            {/* List View */}
            {(!series) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={false}
                                onClick={handlePrevious}
                                size="sm"
                                variant="success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            {(props.parent instanceof Author) ? (
                                <>
                                    <span>Manage Serieses for Author:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.first_name}&nbsp;
                                        {props.parent.last_name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Manage Serieses for Story:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.name}
                                    </span>
                                </>
                            )}
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={true}
                                size="sm"
                                variant="outline-success"
                            >Next</Button>
                        </Col>
                    </Row>

                    <SeriesOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleExclude={handleExclude}
                        handleInclude={handleInclude}
                        handleSelect={handleSelect}
                        included={included}
                        parent={props.parent}
                    />
                    <Button
                        className="mt-3 ml-1"
                        onClick={handleAdd}
                        size="sm"
                        variant="primary"
                    >Add</Button>

                </>
            ) : null}

            {/* Detail View */}
            {(series) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-center">
                            {(series.id > 0) ? (
                                <span>Edit Existing&nbsp;</span>
                            ) : (
                                <span>Add New&nbsp;</span>
                            )}
                            {(props.parent instanceof Author) ? (
                                <>
                                    <span>Series for Author:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.first_name}&nbsp;
                                        {props.parent.last_name}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span>Series for Story:&nbsp;</span>
                                    <span className="text-info">
                                        {props.parent.name}
                                    </span>
                                </>
                            )}
                        </Col>
                        <Col className="text-right">
                            <Button
                                onClick={() => setSeries(null)}
                                size="sm"
                                type="button"
                                variant="secondary"
                            >Back</Button>
                        </Col>
                    </Row>

                    <SeriesForm
                        autoFocus
                        canRemove={canRemove}
                        handleInsert={handleInsert}
                        handleRemove={handleRemove}
                        handleUpdate={handleUpdate}
                        series={series}
                    />

                </>
            ) : null}

        </Container>
    )

}

export default StageSerieses;
