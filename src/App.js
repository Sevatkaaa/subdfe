import React from 'react';
import {Router, Route, browserHistory} from 'react-router';

import './App.css';
import logo from './logo.svg';
import Databases from "./components/Databases";
import Main from "./components/Main";
import Database from "./components/Database";

function App() {
  return (
      <div className="App global-page">
        <Router history={browserHistory}>
          <Route path="/" component={Main} />
          <Route path="/databases" component={Databases} />
          <Route path="/databases/:id" component={Database} />

        </Router>
      </div>
  );
}

export default App;
