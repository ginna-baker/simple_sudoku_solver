const _ = require('lodash')
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const example1 = [
  undefined, undefined, undefined,
  undefined, 2, undefined,
  undefined, undefined, 3,
]
// call the solver with:
// node puzzle_solver --starter=value,value,etc
// Note: ensure that empty squares have undefined or null in them
let puzzleValues;
if (args.starter) {
  puzzleValues = args.starter.split(",");
} else {
  puzzleValues = example1;
}

// TODO: let it solve 9x9 and later other sizes
// Incorporate the concept of squares.  For 3x3, for example, each sq would just be 1 cell, right?
// is the square size just the sq root of the side length?  like would a sudoku of 16 have sq size of 4x4?
// getting into the weeds here, but are all sudokus perfect squares?
// Incorporate an error for unsolvable puzzle
// Incorporate an error for less than the minimum number of clues (numbers shown here at https://en.wikipedia.org/wiki/Mathematics_of_Sudoku#Enumerating_all_possible_Sudoku_solutions)
// could I calculate thses minimums myself?  Not sure what goes into that calculation

const sideLength = 3;
const allPossibilities = _.range(1, sideLength + 1);

// start solving at the top left
let columnNumber = 0;
let rowNumber = 0;
const cells = [];

class Cell {
  constructor(
    columnNumber,
    rowNumber,
    value,
    possibilities,
  ) {
    this.column = columnNumber;
    this.row = rowNumber;
    this.value = value;
    this.possibilities = possibilities;
  }
}

createPuzzle = () => {
  // const values = example1;
  const sideLength = 3;

  // feed in values array to show determined values.
  // undefined will be placeholder for undetermined values
  // make sure values length = the product of length and width
  if (puzzleValues.length != _.multiply(sideLength, sideLength)) {
    throw new Error('Wrong number of cells');
  }

  _.forEach(puzzleValues, (value) => {
    // todo ternary?
    let possibilities = [];
    if (_.isNil(value)) {
      possibilities = allPossibilities; // todo make 'get possibilities' func that sets constant
    }

    const cell = new Cell(
      columnNumber,
      rowNumber,
      value,
      possibilities,
    );

    cells.push(cell);

    // moving from left to right (increase column), then top to bottom (increase row)
    // TODO: wondering if I can do a 1-based numbering instead of 0?
    if (columnNumber < sideLength - 1) {
      columnNumber++;
    } else {
      columnNumber = 0;
      rowNumber++;
    }
  });
},

// recursively narrow down possibilities to solution
solvePuzzle = () => {
  let runAgain = false;

  _.forEach([0, 1, 2], (num) => {
    setRowPossibilities(num)
    setColumnPossibilities(num)
  })

  _.forEach(cells, (cell) => {
    if (cell.possibilities.length == 1) {
      cell.value = _.first(cell.possibilities);
    } else {
      if (cell.possibilities.length > 1) {
        runAgain = true;
      }
    }
  })

  if (runAgain) {
    solvePuzzle()
  }
},

getAllPossibilities = () => {
  // for each cell:
  // get row possibilities
  // get column possibilities
  // find overlap
},

//Todo: create reusable function for both row and column

// if a number already exists in the row
// remove that number from the possibilities arrays of the other cells
setRowPossibilities = (rowNumber) => {
  const rowCells = _.filter(cells, (cell) => {
    return cell.row == rowNumber;
  });

  // get all values that already exist in that row
  const numsToEliminate = _.map(
    _.filter(rowCells, (cell) => {
    return !_.isNil(cell.value)}), 'value');

  // narrow down cell possibilities by removing numbers already in the row
  _.forEach(rowCells, (cell) => {
    if (_.isNil(cell.value)) {
      cell.possibilities = _.difference(cell.possibilities, numsToEliminate)
    }
  })
},
setColumnPossibilities = (columnNumber) => {
  const columnCells = _.filter(cells, (cell) => {
    return cell.column == columnNumber;
  });

  // get all values that already exist in that column
  const numsToEliminate = _.map(
    _.filter(columnCells, (cell) => {
      return !_.isNil(cell.value)
    }),
  'value');

  // narrow down cell possibilities by removing numbers already in the row
  _.forEach(columnCells, (cell) => {
    if (_.isNil(cell.value)) {
      cell.possibilities = _.difference(cell.possibilities, numsToEliminate)
    }
  })
}

  // setSquarePossibilities: () => {};
createPuzzle();
solvePuzzle();
console.log(_.map(cells, 'value'), 'solution');
