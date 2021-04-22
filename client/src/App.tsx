// App -----------------------------------------------------------------------

// Overall implementation of the entire application.

// External Modules ----------------------------------------------------------

import React from 'react';
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
//import NavDropdown from "react-bootstrap/cjs/NavDropdown";
import NavItem from "react-bootstrap/NavItem";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

// Internal Modules ----------------------------------------------------------

import LoggedInUser from "./components/LoggedInUser";
import {LoginContextProvider} from "./contexts/LoginContext";
import HomeView from "./views/HomeView";
//import UsersView from "./views/Users";

// Component Details ---------------------------------------------------------

function App() {
    return (

        <LoginContextProvider>

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
                            width={120}
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-brand"/>

                    <Navbar.Collapse id="basic-navbar-brand">
                        <Nav className="mr-auto">
                            <LinkContainer to="/home">
                                <NavItem className="nav-link">Home</NavItem>
                            </LinkContainer>
                            <LinkContainer to="/users">
                                <NavItem className="nav-link">Users</NavItem>
                            </LinkContainer>
{/*
                            <NavDropdown id="reports" title="Reports">
                                <LinkContainer to="/guestHistoryReport">
                                    <NavDropdown.Item>Guest History</NavDropdown.Item>
                                </LinkContainer>
                                <LinkContainer to="/monthlySummaryReport">
                                    <NavDropdown.Item>Monthly Summary</NavDropdown.Item>
                                </LinkContainer>
                            </NavDropdown>
*/}
                        </Nav>
                    </Navbar.Collapse>

                    <LoggedInUser/>
                    <span className="mr-4"/>
                    <strong>LibrarySelector</strong>
                    {/*
                    <LibrarySelector/>
*/}

                </Navbar>

                <Switch>
{/*
                    <Route exact path="/users">
                        <UsersView/>
                    </Route>
*/}
                    <Route path="/">
                        <HomeView/>
                    </Route>
                </Switch>

            </Router>

        </LoginContextProvider>

    );

}

export default App;

/*
import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/
