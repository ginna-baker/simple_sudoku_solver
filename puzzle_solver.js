const _ = require('lodash');

const SET_TYPE_ROW = 'row';
const SET_TYPE_COLUMN = 'column';
const SET_TYPE_SQUARE = 'square';

let allPossibilities;

// start solving at the top left
let rowNumber = 0;
let columnNumber = 0;
let squareNumber = 0;

class Cell {
  constructor(
    columnNumber,
    rowNumber,
    squareNumber,
    value,
    possibilities,
  ) {
    this.column = columnNumber;
    this.row = rowNumber;
    this.square = squareNumber;
    this.value = value;
    this.possibilities = possibilities;
  }
}

class PuzzleSolver {
  constructor(values) {
    this.puzzleValues = values;
    this.cells = [];
    this.createPuzzle();
  }

  /**
   * Build puzzle
   */
  createPuzzle() {
    const sideLength = Math.sqrt(this.puzzleValues.length);

    // for square puzzles: ensure the side had a square root
    const sqLength = Math.sqrt(sideLength);
    if (sqLength % 1 != 0) {
      throw new Error('Wrong number of cells. Puzzle can\'t create squares.');
    }

    allPossibilities = _.range(1, sideLength + 1);

    if (this.puzzleValues.length != _.multiply(sideLength, sideLength)) {
      throw new Error('Wrong number of cells');
    }

    // if values are outside the possibilities, throw error
    let adder = 0;
    _.forEach(this.puzzleValues, (value) => {
      let possibilities = [];
      if (!value) {
        possibilities = allPossibilities;
      }

      const cell = new Cell(
        columnNumber,
        rowNumber,
        squareNumber,
        value,
        possibilities,
      );

      this.cells.push(cell);

      /*
      * moving from left to right (increase column), then top to bottom (increase row)
      * every third column / row, the square number should increase
      **/

      // column keeps incrementing
      if (columnNumber < sideLength - 1) {
        columnNumber++;
        if (columnNumber % 3 === 0) {
          squareNumber++;
        }
      } else {
        columnNumber = 0;
        squareNumber = adder;
        rowNumber++;

        // @adder is the baseline for squares, allowing us to return to the beginning of the row while keeping the correct square count
        if (rowNumber % sqLength === 0) {
          adder = rowNumber;
          squareNumber = adder;
        }
      }
    });
  }

  /**
   * @index Number: row or column number to examine
   * @type string: "row", "column", or "square"
   *
   * Assumption: cellGroup can contain each value only ONCE
   *    Check which values already exist in the cellGroup
   *    Eliminate those values from the other cells in the group
   */
  setPossibilities(index, type) {
    const cellGroup = _.filter(this.cells, (cell) => {
      return cell[type] === index;
    });

    const cellsWithValues = _.filter(cellGroup, (cell) => {
      return !!cell.value;
    });

    const numsToEliminate = _.map(cellsWithValues, 'value');

    // Process of elimination:
    // Removing values already in the group from other group cells' possibilities array
    _.forEach(cellGroup, (cell) => {
      if (!cell.value) {
        cell.possibilities = _.difference(cell.possibilities, numsToEliminate);
      }
    });
  }

  // recursively narrow down possibilities to solution
  solvePuzzle() {
    let runAgain = false;

    // rows and columns are 0-indexed
    const indices = _.map(allPossibilities, (p) => {
      return p - 1;
    });

    _.forEach(indices, (i) => {
      this.setPossibilities(i, SET_TYPE_ROW);
      this.setPossibilities(i, SET_TYPE_COLUMN);
      this.setPossibilities(i, SET_TYPE_SQUARE);
    });

    // set values for cells with only 1 possibility
    // runAgain if any cell has more than 1 possibility
    // throw error if cell has no value and 0 possibilities
    _.forEach(this.cells, (cell) => {
      if (cell.possibilities.length == 1) {
        cell.value = _.first(cell.possibilities);
      } else if (cell.possibilities.length > 1) {
          runAgain = true;
      } else if (cell.possibilities.length == 0 && !cell.value) {
        throw new Error('Faulty puzzle: a cell has 0 possible values');
      }
    });

    if (runAgain) {
      this.solvePuzzle();
    }

    return _.map(this.cells, 'value');
  }
}



// TODO: let it solve other sizes
// getting into the weeds here, but are all sudokus perfect squares?
// Incorporate an error for less than the minimum number of clues (numbers shown here at https://en.wikipedia.org/wiki/Mathematics_of_Sudoku#Enumerating_all_possible_Sudoku_solutions)
// could I calculate thses minimums myself?  Not sure what goes into that calculation
module.exports = PuzzleSolver;