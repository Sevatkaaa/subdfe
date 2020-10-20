import axios from 'axios';
import React, {Component} from "react";
import {browserHistory} from "react-router";
import {Col, Row, Button, Dropdown, FormControl, FormGroup,} from "react-bootstrap";
import {NotificationContainer, NotificationManager} from "react-notifications";
import 'react-notifications/lib/notifications.css';
import '../App.css';

import DropdownToggle from "react-bootstrap/DropdownToggle";
import DropdownMenu from "react-bootstrap/DropdownMenu";

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            databaseId: this.props.params.id,
            id: this.props.params.tableId,
            table: {},
            isLoading: false,
            lineObjValue: {},
            errors: {},
            filterLines: []
        }
    }

    componentDidMount() {
        this.getTable();
    }

    getTable() {
        axios.get("http://db-management-system.herokuapp.com/api/tables/" + this.state.id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                console.log(response.data);
                this.setState({table: response.data});
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    redirect(path) {
        browserHistory.push(path);
    };

    deleteTable(id) {
        axios.delete("http://db-management-system.herokuapp.com/api/table?tableId=" + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                this.redirect(`/databases/${this.state.databaseId}`);
                NotificationManager.success("Table deleted", "Success");
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    findByValue() {
        axios.get("http://db-management-system.herokuapp.com/api/linesByLineObjValue?tableId=" + this.state.id + "&lineObjValue=" + this.lineObjValue.value, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                let data = response.data;
                this.setState({filterLines: data.map(l => l.id)});
                NotificationManager.success("Lines filtered", "Success");
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    showAll() {
        this.setState({filterLines: this.state.table.lines.map(l => l.id)});
    }

    deleteLine(id) {
        axios.delete("http://db-management-system.herokuapp.com/api/line?lineId=" + id, {
            headers: {
                'Content-Type': 'application/json'
            }
        })
            .then((response) => {
                this.getTable();
                NotificationManager.success("Line deleted", "Success");
            })
            .catch((error) => {
                console.log('Error *** : ' + error);
            });
    }

    render() {
        let _this = this;
        let lines = this.state.table.lines ? this.state.table.lines : [];
        if (this.state.filterLines.length !== 0) {
            lines = lines.filter(l => this.state.filterLines.includes(l.id))
        }
        console.log(lines);
        return (
            <div className="Users">
                {this.state.isLoading ? <div className="application-loading"/> : null}
                <h2 className="text-center">Manage Table "{this.state.table.name}"</h2>
                <div className={"header-preview"}>
                    <Button className={"invite-agent ml-40"} onClick={function () {
                        _this.redirect(`/databases/${_this.state.databaseId}`);
                    }}>
                        Go to database
                    </Button>
                    <Button className={"invite-agent ml-40"} onClick={function () {
                        _this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.id}/line`)
                    }}>
                        Add Line
                    </Button>
                    <Button className={"invite-agent ml-40"} onClick={function () {
                        _this.redirect(`/databases/${_this.state.databaseId}/tables/${_this.state.id}/attribute`)
                    }}>
                        Add attribute
                    </Button>
                    <Button className={"invite-agent ml-40"} onClick={function () {
                        _this.deleteTable(_this.state.id);
                    }}>
                        Delete table
                    </Button>
                    <Row key={"header-row-value"} className={"header-row-value"}>
                        <Col sm={{span: 3, offset: 2}}>

                        <Button onClick={function () {
                        _this.findByValue();
                    }}>
                        Filter by value
                    </Button>
                        </Col>
                        <Col sm={{span: 4}}>
                        <FormGroup controlId="formGroupFirstName">
                        <FormControl ref={ref => {this.lineObjValue = ref}} type="text"/>
                        <span id="firstName-error" style={{color: "red"}}>{this.state.errors["firstName"]}</span>
                    </FormGroup>
                        </Col>
                        <Col sm={{span: 3}}>

                            <Button onClick={function () {
                                _this.showAll();
                            }}>
                                Show all
                            </Button>
                        </Col>
                    </Row>
                </div>
                <br/>
                <Row className={"data-table"}>
                    <Col sm={{span: 11}} className={"user-table"}>
                        {this.state.isLoading ? <div className="application-loading"/>
                            :
                            <div>
                                <Row className="user-preview-header">
                                    <Col sm={{span: 2}}><b>Line id</b></Col>
                                    <Col sm={{span: 4}}><b>Attributes</b></Col>
                                    <Col sm={{span: 3}}><b>Values</b></Col>
                                </Row>
                                {lines.map((line) => {
                                    return (
                                        <Row className="user-preview" key={line.id}>
                                            <Col sm={{span: 2}}>{line.id}</Col>
                                            <Col sm={{span: 4}}>
                                                {line.lineObjects.map(line => {
                                                    let at = this.state.table.header.attributes.find(t => t.name === line.name);
                                                    return (
                                                        <div key={"line" + line.id}>
                                                            {at.name + "(" + at.type + ", max=" + at.maxLength + ")" + " "} <br/>
                                                        </div>
                                                    );}
                                                )}
                                            </Col>
                                            <Col sm={{span: 3}}>
                                                {line.lineObjects.map(at => {
                                                    return (
                                                        <div key={"lineObj" + at.id}>
                                                            {at.value} <br/>
                                                        </div>
                                                    );}
                                                )}
                                            </Col>
                                            <Col sm={{span: 3}}>
                                                <Dropdown className={"user-actions"}>
                                                    <DropdownToggle className={"user-actions-dropdown"} variant="outline-primary" id="dropdown-basic">
                                                        Actions
                                                    </DropdownToggle>

                                                    <DropdownMenu>
                                                        <Dropdown.Item onClick={function () {
                                                            _this.redirect("/databases/" + _this.state.databaseId + "/tables/" + _this.state.id + "/lines/" + line.id);
                                                        }}>
                                                            View/Edit data
                                                        </Dropdown.Item>
                                                        <Dropdown.Item onClick={function () {
                                                            _this.deleteLine(line.id);
                                                        }}>
                                                            Delete line
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