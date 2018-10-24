import React, { Component } from 'react';
import Grid from './grid/grid.js';
import Sidebar from './sidebar/sidebar.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h5>Simple Sudoku</h5>
        </header>
        <body className="App-body">
          <div className="sidebar">
            <Sidebar></Sidebar>
          </div>
          <div className="grid">
            <Grid></Grid>
          </div>
        </body>
      </div>
    );
  }
}

export default App;
