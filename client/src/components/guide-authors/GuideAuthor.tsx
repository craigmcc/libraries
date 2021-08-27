// GuideAuthor ---------------------------------------------------------------

// Guided management of overall Library information, starting from an Author.

// External Modules ----------------------------------------------------------

import {useContext, useState} from "react";
import Container from "react-bootstrap/Container";

// Internal Modules ----------------------------------------------------------

import AuthorSummary from "./AuthorSummary";
import StageAuthor from "./StageAuthor";
// import StageSeries from "./StageSeries";
// import StageVolumes from "./StageVolumes";
import {Stage} from "../guide-shared/Stage";
import StageStories from "../guide-shared/StageStories";
import LibraryContext from "../../contexts/LibraryContext";
//import useFetchAuthor from "../../hooks/useFetchAuthor";
import Author from "../../models/Author";
import * as Abridgers from "../../util/abridgers";
import logger from "../../util/client-logger";

// Component Details ---------------------------------------------------------

const GuideAuthor = () => {

}

export default GuideAuthor;
