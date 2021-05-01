// App -----------------------------------------------------------------------

// Overall implementation of the entire application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {LinkContainer} from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import LibrarySelector from "./components/LibrarySelector";
import LoggedInUser from "./components/LoggedInUser";
import {LibraryContextProvider} from "./contexts/LibraryContext";
import {LoginContextProvider} from "./contexts/LoginContext";
import HomeView from "./components/HomeView";
import AuthorView from "./components/authors/AuthorView";
import LibraryView from "./components/libraries/LibraryView";
import SeriesView from "./components/series/SeriesView";
import StoryView from "./components/stories/StoryView";
import UserView from "./components/users/UserView";
import VolumeView from "./components/volumes/VolumeView";

// Component Details ---------------------------------------------------------

function App() {
    return (

        <LoginContextProvider>
        <LibraryContextProvider>

            <Router>

                <Navbar
                    bg="info"
                    className="mb-3"
                    expand="lg"
                    sticky="top"
                    variant="dark"
                >

                    <Navbar.Brand>
                        <img
                            alt="Libraries Logo"
                            height={60}
                            src="./books.jpeg"
                            width={100}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-brand"/>

                    <Navbar.Collapse id="basic-navbar-brand">
                        <Nav className="mr-auto">
                            <LinkContainer to="/home">
                                <NavItem className="nav-link">Home</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/authors">
                                <NavItem className="nav-link">Authors</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/series">
                                <NavItem className="nav-link">Series</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/stories">
                                <NavItem className="nav-link">Stories</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/volumes">
                                <NavItem className="nav-link">Volumes</NavItem>
                            </LinkContainer>
                            <NavDropdown id="master" title="Masters">
                                <LinkContainer to="/libraries">
                                    <NavDropdown.Item>Libraries</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/users">
                                    <NavDropdown.Item>Users</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
                        </Nav>
                    </Navbar.Collapse>

                    <LoggedInUser/>
                    <span className="mr-4"/>
                    <LibrarySelector/>

                </Navbar>

                <Switch>
                    <Route exact path="/authors">
                        <AuthorView/>
                    </Route>
                    <Route exact path="/libraries">
                        <LibraryView/>
                    </Route>
                    <Route exact path="/series">
                        <SeriesView/>
                    </Route>
                    <Route exact path="/stories">
                        <StoryView/>
                    </Route>
                    <Route exact path="/users">
                        <UserView/>
                    </Route>
                    <Route exact path="/volumes">
                        <VolumeView/>
                    </Route>
                    <Route path="/">
                        <HomeView/>
                    </Route>
                </Switch>

            </Router>

        </LibraryContextProvider>
        </LoginContextProvider>

    );

}

export default App;
