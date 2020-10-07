import axios from 'axios';
import React, {Component} from "react";
import {browserHistory} from "react-router";
import {Col, Row, Button, Dropdown,} from "react-bootstrap";
import NotificationContainer from "react-notifications";

import '../App.css';

import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export default class Databases extends Component {
    constructor(props) {
        super(props);
        this.state = {
            databases: [],
            isLoading: false,
        };
    }

    componentDidMount() {
        console.log("123 databases");
        axios.get("http://localhost:8080/api/databases", {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({databases: response.data});
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    redirect(path) {
        browserHistory.push(path);
    };

    render() {
        let _this = this;

        return (
            <div className="Users">
                <h2 className="text-center">Manage Databases</h2>
                <div className={"header-preview"}>
                    Manage your databases, tables, data<br/>
                    <Button className={"invite-agent"} onClick={function () {
                        _this.redirect(`/database`)
                    }}>
                        Add Database
                    </Button>
                </div>
                <br/>
                <Row className={"data-table"}>
                    <Col sm={{span: 11}} className={"user-table"}>
                        {this.state.isLoading ? <div className="application-loading"/>
                            :
                            <div>
                                <Row className="user-preview-header">
                                    <Col sm={{span: 2}}><b>Database name</b></Col>
                                    <Col sm={{span: 7}}><b>Tables</b></Col>
                                </Row>
                                {this.state.databases.map((db) => {
                                    return (
                                        <Row className="user-preview" key={db.id}>
                                            <Col sm={{span: 2}}>{db.name}</Col>
                                            <Col sm={{span: 7}}>{db.tables.map(t => t.name + " ")}</Col>
                                            {/*<Col sm={{span: 3}}>{agent.email}</Col>*/}
                                            {/*<Col sm={{span: 1}}>{agent.status === "REGISTERED" ? "Yes" : "No"}</Col>*/}
                                            <Col sm={{span: 3}}>
                                                <Dropdown className={"user-actions"}>
                                                    <DropdownToggle className={"user-actions-dropdown"} variant="outline-primary" id="dropdown-basic">
                                                        Actions
                                                    </DropdownToggle>

                                                    <DropdownMenu>
                                                        <Dropdown.Item>
                                                            View/Edit information
                                                        </Dropdown.Item>
                                                        <Dropdown.Item>
                                                            View/Edit teams
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={function () {
                                                        }}>
                                                            Re-Send
                                                            Invitation
                                                        </Dropdown.Item>
                                                    </DropdownMenu>
                                                </Dropdown>
                                            </Col>
                                        </Row>
                                    );
                                })}
                                <Row className="empty-user-preview" key="empty-user-preview"/>
                            </div>
                        }
                    </Col>
                </Row>
                <NotificationContainer/>
            </div>
        )
    }
}