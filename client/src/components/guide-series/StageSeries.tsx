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
import SeriesClient from "../../clients/SeriesClient";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import Series from "../../models/Series";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

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
            msg: "Adding new Series",
            series: newSeries,
        });
        setSeries(newSeries);
    }

    const handleEdit: HandleSeries = (newSeries) => {
        logger.debug({
            context: "StageSeries.handleEdit",
            msg: "Editing existing Series",
            series: newSeries,
        });
        setSeries(newSeries);
    }

    const handleInsert: HandleSeries = async (newSeries) => {
        logger.debug({
            context: "StageSeries.handleInsert",
            msg: "Inserting new Series",
            series: newSeries,
        });
        try {

            // Persist the requested Series
            const inserted = await SeriesClient.insert(libraryId, newSeries);
            logger.info({
                context: "StageSeries.handleInsert",
                msg: "Inserted new Series",
                series: inserted,
            });
            setSeries(null);

            // Select the inserted Series, and switch to Authors stage
            handleSelect(inserted);

        } catch (error) {
            ReportError("StageSeries.handleInsert", error);
        }
    }

    const handleRemove: HandleSeries = async (newSeries) => {
        logger.debug({
            context: "StageSeries.handleRemove",
            msg: "Removing existing Series",
            series: newSeries,
        });
        try {
            await SeriesClient.remove(libraryId, newSeries.id);
            logger.info({
                context: "StageSeries.handleRemove",
                msg: "Removed existing Series",
                series: newSeries,
            });
            setSeries(null);
            if (newSeries.id === props.series.id) {
                props.handleSeries(new Series()); // Unselect if we were current
            }
        } catch (error) {
            ReportError("StageSeries.handleRemove", error);
        }
        props.handleRefresh();
    }

    const handleSelect: HandleSeries = (newSeries) => {
        logger.debug({
            context: "StageSeries.handleSelect",
            msg: "Selecting existing Series",
            series: newSeries,
        });
        props.handleSeries(newSeries);
        props.handleStage(Stage.AUTHORS);
    }

    const handleUpdate: HandleSeries = async (newSeries) => {
        logger.debug({
            context: "StageSeries.handleUpdate",
            msg: "Updating existing Series",
            series: newSeries,
        });
        try {
            await SeriesClient.update(libraryId, newSeries.id, newSeries);
            logger.info({
                context: "StageSeries.handleUpdate",
                msg: "Updated existing Series",
                series: newSeries,
            });
            setSeries(null);
        } catch (error) {
            ReportError("StageSeries.handleUpdate", error);
        }
        // If we updated the currently selected Series, propagate to summary
        if (newSeries.id === props.series.id) {
            props.handleSeries(newSeries);
        }
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
