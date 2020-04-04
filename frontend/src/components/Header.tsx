import * as React from 'react';
import { Link, Router } from 'react-router-dom';
import '../stylesheets/Header.scss';

const Header: () => JSX.Element = () => (
  <div className="App-header">
    <Link to="/">
      <img src="public/logo.svg" alt="Logo" />
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

export default Header;
