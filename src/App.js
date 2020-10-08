import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import './App.css';
import logo from './logo.svg';
import Databases from "./components/Databases";
import Main from "./components/Main";
import Database from "./components/Database";
import Table from "./components/Table";
import AddDatabase from "./components/AddDatabase";
import AddTable from "./components/AddTable";
import AddAttribute from "./components/AddAttribute";

function App() {
  return (
      <div className="App global-page">
        <Router history={browserHistory}>
          <Route path="/" component={Main} />
            <Route path="/database" component={AddDatabase} />
            <Route path="/databases" component={Databases} />
          <Route path="/databases/:id" component={Database} />
            <Route path="/databases/:id/table" component={AddTable} />
            <Route path="/databases/:id/tables/:tableId" component={Table} />
            <Route path="/databases/:id/tables/:tableId/attribute" component={AddAttribute} />

        </Router>
      </div>
  );
}

export default App;
