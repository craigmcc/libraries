// UsersSubview --------------------------------------------------------------

// Render a list of application Users, with a callback handler when a particular
// user is selected (or null for deselected).

// External Modules ----------------------------------------------------------

import React, {useEffect, useState} from "react";
import Container from "react-bootstrap/Container";
import Table from "react-bootstrap/Table";

// Internal Modules ----------------------------------------------------------

import UserClient from "../clients/UserClient";
import {HandleIndex, HandleUserOptional} from "../components/types";
import User from "../models/User";
import * as Abridgers from "../util/abridgers";
import logger from "../util/client-logger";
import ReportError from "../util/ReportError";

// Incoming Properties -------------------------------------------------------

export interface Props {
    handleSelect: HandleUserOptional;   // Handle User selection or deselection
    title?: string;                     // Table title [Libraries Application User]
}

// Component Details ---------------------------------------------------------

const UsersSubview = (props: Props) => {

    const [index, setIndex] = useState<number>(-1);
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const newUsers: User[] = await UserClient.all();
                setIndex(-1);
                setUsers(newUsers);
                logger.debug({
                    context: "UsersSubview.fetchUsers",
                    count: newUsers.length,
                    users: newUsers,
                });

            } catch (error) {
                setIndex(-1);
                setUsers([]);
                if (error.response && (error.response.status === 403)) {
                    logger.debug({
                        context: "UsersSubview.fetchUsers",
                        msg: "FORBIDDEN",
                    });
                } else {
                    ReportError("UsersSubview.fetchUsers", error);
                }
            }
        }

        fetchUsers();

    }, []);

    const handleIndex: HandleIndex = (newIndex) => {
        if (newIndex === index) {
            setIndex(-1);
            logger.trace({
                context: "UsersSubview.handleIndex",
                msg: "UNSET" });
            if (props.handleSelect) {
                props.handleSelect(null);
            }
        } else {
            const newUser = users[newIndex];
            setIndex(newIndex);
            logger.debug({
                context: "UsersSubview.handleIndex",
                index: newIndex,
                user: Abridgers.USER(newUser),
            });
            if (props.handleSelect) {
                props.handleSelect(newUser);
            }
        }
    }

    return (

        <Container fluid id="UsersSubview">

            <Table
                bordered={true}
                hover={true}
                size="sm"
                striped={true}
            >

                <thead>
                    <tr className="table-dark">
                        <th
                            className="text-center"
                            colSpan={3}
                            key={101}
                        >
                            {props.title ? props.title : "Libraries Application Users"}
                        </th>
                    </tr>
                    <tr className="table-secondary">
                        <th scope="col>">Username</th>
                        <th scope="col">Active</th>
                        <th scope="col">Scope</th>
                    </tr>
                </thead>

                <tbody>
                {users.map((user, rowIndex) => (
                    <tr
                        className={"table-" +
                            (rowIndex === index ? "primary" : "default")}
                        key={1000 + (rowIndex * 100)}
                        onClick={() => (handleIndex(rowIndex))}
                    >
                        <td key={1000 + (rowIndex * 100) + 1}>
                            {user.username}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 2}>
                            {user.active}
                        </td>
                        <td key={1000 + (rowIndex * 100) + 3}>
                            {user.scope}
                        </td>
                    </tr>
                ))}
                </tbody>

            </Table>

        </Container>

    )

}

export default UsersSubview;
