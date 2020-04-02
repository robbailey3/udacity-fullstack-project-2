import * as React from 'react';
import { Link, Router } from 'react-router-dom';
import '../stylesheets/Header.scss';
// import logo from "../logo.svg";

export default class Header extends React.Component {
  navTo(uri) {
    window.location.href = window.location.origin + uri;
  }

  render() {
    return (
      <div className="App-header">
        <Link to="/">
          <span className="logo">Udacitrivia</span>
        </Link>
        <Link to="/">
          <h2>List</h2>
        </Link>
        <Link to="/add">
          <h2>Add</h2>
        </Link>
        <Link to="/play">
          <h2>Play</h2>
        </Link>
      </div>
    );
  }
}
