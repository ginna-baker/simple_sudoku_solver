import React, { Component } from 'react';
import Grid from './grid/grid.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h5>Simple Sudoku</h5>
        <Grid></Grid>
        </header>
      </div>
    );
  }
}

export default App;
