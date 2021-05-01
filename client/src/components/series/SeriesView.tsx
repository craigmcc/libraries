// SeriesView -------------------------------------------------------------

// Administrator view for editing Series.

// External Modules ----------------------------------------------------------

import React, {useContext, useEffect, useState} from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

// Internal Modules ----------------------------------------------------------

import SeriesChildren from "./SeriesChildren";
import SeriesClient from "../../clients/SeriesClient";
import {HandleSeries, HandleSeriesOptional, Scopes} from "../types";
import LibraryContext from "../../contexts/LibraryContext";
import LoginContext from "../../contexts/LoginContext";
import SeriesForm from "./SeriesForm";
import Author from "../../models/Author";
import Series from "../../models/Series";
import Story from "../../models/Story";
import SeriesList from "./SeriesList";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";
import ReportError from "../../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    base?: Author | Story;              // Parent object to select for [Library]
    nested?: boolean;                   // Show nested child list? [false]
    title?: string;                     // Table title [Series for Library: XXXXX]
}

// Component Details ---------------------------------------------------------

const SeriesView = (props: Props) => {

    const libraryContext = useContext(LibraryContext);
    const loginContext = useContext(LoginContext);

    const [canAdd, setCanAdd] = useState<boolean>(true);
    const [canEdit, setCanEdit] = useState<boolean>(true);
    const [canRemove, setCanRemove] = useState<boolean>(true);
    const [libraryId, setLibraryId] = useState<number>(-1);
    const [nested] = useState<boolean>((props.nested !== undefined)
        ? props.nested : false);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [series, setSeries] = useState<Series | null>(null);

    useEffect(() => {

        logger.info({
            context: "SeriesView.useEffect",
            base: props.base,
            nested: props.nested,
            title: props.title,
        });

        // Record current Library ID
        setLibraryId(libraryContext.state.library.id);

        // Record current permissions
        const isRegular = loginContext.validateScope(Scopes.REGULAR);
        setCanAdd(isRegular);
        setCanEdit(isRegular);
        setCanRemove(loginContext.validateScope(Scopes.SUPERUSER));

        // Reset refresh flag if set
        if (refresh) {
            setRefresh(false);
        }

    }, [libraryContext, loginContext, refresh,
        props.base, props.nested, props.title]);

    const handleInsert: HandleSeries = async (newSeries) => {
        try {
            newSeries.library_id = libraryId;
            const inserted: Series = await SeriesClient.insert(libraryId, newSeries);
            setRefresh(true);
            setSeries(null);
            logger.trace({
                context: "SeriesView.handleInsert",
                series: Abridgers.SERIES(inserted),
            });
        } catch (error) {
            ReportError("SeriesView.handleInsert", error);
        }
    }

    const handleRemove: HandleSeries = async (newSeries) => {
        try {
            const removed: Series = await SeriesClient.remove(libraryId, newSeries.id);
            setRefresh(true);
            setSeries(null);
            logger.trace({
                context: "SeriesView.handleRemove",
                series: Abridgers.SERIES(removed),
            });
        } catch (error) {
            ReportError("SeriesView.handleRemove", error);
        }
    }

    const handleSelect: HandleSeriesOptional = (newSeries) => {
        if (newSeries) {
            if (canEdit) {
                setSeries(newSeries);
            }
            logger.trace({
                context: "SeriesView.handleSelect",
                canEdit: canEdit,
                canRemove: canRemove,
                series: Abridgers.SERIES(newSeries),
            });
        } else {
            setSeries(null);
            logger.trace({
                context: "SeriesView.handleSelect",
                msg: "UNSET"
            });
        }
    }

    const handleUpdate: HandleSeries = async (newSeries) => {
        try {
            const updated: Series =
                await SeriesClient.update(libraryId, newSeries.id, newSeries);
            setRefresh(true);
            setSeries(null);
            logger.trace({
                context: "SeriesView.handleUpdate",
                series: Abridgers.SERIES(updated),
            });
        } catch (error) {
            ReportError("SeriesView.handleUpdate", error);
        }
    }

    const onAdd = () => {
        const newSeries: Series = new Series({
            library_id: libraryId,
        });
        setSeries(newSeries);
        logger.trace({
            context: "SeriesView.onAdd",
            series: newSeries
        });
    }

    const onBack = () => {
        setSeries(null);
        logger.trace({
            context: "SeriesView.onBack"
        });
    }

    return (
        <>
            <Container fluid id="SeriesView">

                {/* List View */}
                {(!series) ? (

                    <>

                        <Row className="ml-1 mr-1 mb-3">
                            <SeriesList
                                base={props.base ? props.base : undefined}
                                handleSelect={handleSelect}
                                nested={nested}
                                title={props.title ? props.title : undefined}
                            />
                        </Row>

                        <Row className="ml-1 mr-1">
                            <Button
                                disabled={!canAdd}
                                onClick={onAdd}
                                size="sm"
                                variant="primary"
                            >
                                Add
                            </Button>
                        </Row>

                    </>

                ) : null }

                {(series) ? (

                    <>

                        <Row id="SeriesDetails" className="mr-1">

                            <Col id="SeriesFormView">

                                <Row className="ml-1 mr-1 mb-3">
                                    <Col className="text-left">
                                        <strong>
                                            <>
                                                {(series.id < 0) ? (
                                                    <span>Adding New</span>
                                                ) : (
                                                    <span>Editing Existing</span>
                                                )}
                                                &nbsp;Series for Library:&nbsp;
                                                {libraryContext.state.library.name}
                                            </>
                                        </strong>
                                    </Col>
                                    <Col className="text-right">
                                        <Button
                                            onClick={onBack}
                                            size="sm"
                                            type="button"
                                            variant="secondary"
                                        >
                                            Back
                                        </Button>
                                    </Col>
                                </Row>

                                <Row className="ml-1 mr-1">
                                    <SeriesForm
                                        autoFocus
                                        canRemove={canRemove}
                                        handleInsert={handleInsert}
                                        handleRemove={handleRemove}
                                        handleUpdate={handleUpdate}
                                        series={series}
                                    />
                                </Row>

                            </Col>

                            {((series.id > 0) && !nested) ? (
                                <Col id="seriesChildren" className="bg-light">
                                    <SeriesChildren
                                        series={series}
                                    />
                                </Col>
                            ) : null}

                        </Row>

                    </>

                ) : null }

            </Container>
        </>
    )

}

export default SeriesView;
