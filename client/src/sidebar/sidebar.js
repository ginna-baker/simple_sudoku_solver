import React, { Component } from 'react';
import './sidebar.css';

class Sidebar extends Component {
  render() {
    return (
      <div className="sidebar">
        <button className="newPuzzle">New Puzzle</button>
        <button className="simpleHint">Hint</button>
      </div>
    )
  }
}

export default Sidebar;