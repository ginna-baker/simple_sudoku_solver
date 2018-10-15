import React, { Component } from 'react';
import Cell from '../cell/cell.js';
import './grid.css';
const puzzle = {
  "puzzle": "080032001703080002500007030050001970600709008047200050020600009800090305300820010",
  "solution": "489532761713486592562917834258341976631759248947268153125673489876194325394825617"
}

class Grid extends Component {
  render() {
    const cells = puzzle.puzzle.split('').map((item, index) => {
      return (<Cell key={index} val={item}> {item} </Cell>)
    })
    return (
      <div className="grid">
        {cells}
      </div>
    )
  }
}

export default Grid;