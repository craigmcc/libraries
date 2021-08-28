// StageSeries ---------------------------------------------------------------

// Select the Series to process for subsequent stages, while offering the option
// to edit existing Series or create a new one.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SeriesOptions from "./SeriesOptions";
import {HandleAction, HandleSeries, OnAction, Scopes} from "../types";
import {HandleStage, Stage} from "../guide-shared/Stage";
import SeriesForm from "../series/SeriesForm";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import useMutateSeries from "../../hooks/useMutateSeries";
import Series from "../../models/Series";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleRefresh: HandleAction;        // Trigger a UI refresh
    handleSeries: HandleSeries;         // Handle request to select a Series
    handleStage: HandleStage;           // Handle changing guide stage
    series: Series;                     // Currently selected Series (if id>0)
}

// Component Details ---------------------------------------------------------

const StageSeries = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canRemove, setCanRemove] = useState<boolean>(false);
    const [libraryId] = useState<number>(libraryContext.state.library.id);
    const [series, setSeries] = useState<Series | null>(null);

    const [{performInsert, performRemove, performUpdate/*, error, processing*/}]
        = useMutateSeries({
            library: libraryContext.state.library,
            parent: libraryContext.state.library,
        })

    useEffect(() => {

        logger.info({
            context: "StageSeries.useEffect",
            series: Abridgers.SERIES(props.series),
        });

        // Record current permissions
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

    }, [libraryContext.state.library.id, loginContext, loginContext.state.loggedIn,
        libraryId, props.series]);

    const handleAdd: OnAction = () => {
        const newSeries = new Series({
            copyright: null,
            library_id: libraryId,
            name: null,
            notes: null,
        });
        logger.debug({
            context: "StageSeries.handleAdd",
            series: newSeries,
        });
        setSeries(newSeries);
    }

    const handleEdit: HandleSeries = (theSeries) => {
        logger.debug({
            context: "StageSeries.handleEdit",
            series: Abridgers.SERIES(theSeries),
        });
        setSeries(theSeries);
    }

    const handleInsert: HandleSeries = async (theSeries) => {
        const inserted = await performInsert(theSeries)
        handleSelect(inserted);
    }

    const handleRemove: HandleSeries = async (theSeries) => {
        await performRemove(theSeries);
        setSeries(null);
        props.handleSeries(new Series());
    }

    const handleSelect: HandleSeries = (theSeries) => {
        logger.debug({
            context: "StageSeries.handleSelect",
            series: theSeries,
        });
        props.handleSeries(theSeries);
        props.handleStage(Stage.AUTHORS);
    }

    const handleUpdate: HandleSeries = async (theSeries) => {
        const updated = await performUpdate(theSeries);
        setSeries(null);
        props.handleSeries(updated);
        props.handleRefresh();
    }

    return (
        <Container fluid id="StageSeries">

            {/* List View */}
            {(!series) ? (
                <>

                    <Row className="mb-3 ml-1 mr-1">
                        <Col className="text-left">
                            <Button
                                disabled={true}
                                size="sm"
                                variant="outline-success"
                            >Previous</Button>
                        </Col>
                        <Col className="text-center">
                            <span>Select or Create Series for Library:&nbsp;</span>
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
                        </Col>
                        <Col className="text-right">
                            <Button
                                disabled={props.series.id <= 0}
                                onClick={() => props.handleStage(Stage.AUTHORS)}
                                size="sm"
                                variant={(props.series.id <= 0) ? "outline-success" : "success"}
                            >Next</Button>
                        </Col>
                    </Row>

                    <SeriesOptions
                        handleAdd={handleAdd}
                        handleEdit={handleEdit}
                        handleSelect={handleSelect}
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
                                <span>Edit Existing</span>
                            ) : (
                                <span>Add New</span>
                            )}
                            &nbsp;Series for Library:&nbsp;
                            <span className="text-info">
                                {libraryContext.state.library.name}
                            </span>
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

export default StageSeries;
