import React, { Component } from 'react';
import './cell.css';

class Cell extends Component {
  render() {
    let cellToReturn;
    if (this.props.val != 0) {
      cellToReturn = <div className="cell filled"> {this.props.val}</div>
    } else {
      cellToReturn = <input type="number" className="cell empty" min="1" max="9"></input>
    }
    return ( cellToReturn );

      // <div>

      // {/* </div> */}
    }
}

export default Cell;
