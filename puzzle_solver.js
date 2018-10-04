const _ = require('lodash');
const minimist = require('minimist');

// TO RUN THE PUZZLE SOLVER:
// On the command line,
// node puzzle_solver --starter=value,value,etc
// Note: all empty squares must have a value of 0, undefined or null

const args = minimist(process.argv.slice(2));
// 3x3
// const example1 = [
//   undefined, undefined, undefined,
//   undefined, 2, undefined,
//   undefined, undefined, 3,
// ];

// 9x9
const example1 = [
  5, 3, 0, 0, 7, 0, 0, 0, 0,
  6, 0, 0, 1, 9, 5, 0, 0, 0,
  0, 9, 8, 0, 0, 0, 0, 6, 0,

  8, 0, 0, 0, 6, 0, 0, 0, 3,
  4, 0, 0, 8, 0, 3, 0, 0, 1,
  7, 0, 0, 0, 2, 0, 0, 0, 6,

  0, 6, 0, 0, 0, 0, 2, 8, 0,
  0, 0, 0, 4, 1, 9, 0, 0, 5,
  0, 0, 0, 0, 8, 0, 0, 7, 9,
];

const SET_TYPE_ROW = 'row';
const SET_TYPE_COLUMN = 'column';
const SET_TYPE_SQUARE = 'square';

let allPossibilities;

// start solving at the top left
let rowNumber = 0;
let columnNumber = 0;
let squareNumber = 0;
const cells = [];

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

/**
 * Build puzzle from command line args
 */
createPuzzle = () => {
  let puzzleValues;
  if (args.starter) {
    puzzleValues = args.starter.split(",");
  } else {
    puzzleValues = example1;
  }

  const sideLength = Math.sqrt(puzzleValues.length);

  // for square puzzles: ensure the side had a square root
  if (sideLength > 3 && Math.sqrt(sideLength) % 1 != 0) {
    throw new Error('Wrong number of cells. Puzzle can\'t create squares.');
  }

  allPossibilities = _.range(1, sideLength + 1);

  if (puzzleValues.length != _.multiply(sideLength, sideLength)) {
    throw new Error('Wrong number of cells');
  }

  // if values are outside the possibilities, throw error
  let adder = 0;
  _.forEach(puzzleValues, (value) => {
    // todo ternary?
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
    cells.push(cell);

    // moving from left to right (increase column), then top to bottom (increase row)
    // every third column, the square number should increase
    // unless we reset the column to 0.  Then,
    // every third row, the square number should either increase or go back to the 'adder',
    // which represents the left-hand square number for the current row.
    // for example, rows 0, 1, and 2 start in sq 0
    // rows 3, 4, and 5 all start in square 3

    // column keeps incrementing
    if (columnNumber < sideLength - 1) {
      columnNumber++;
      if (columnNumber % 3 === 0) {
        // increment square
        squareNumber++;
      }
    } else {
      columnNumber = 0;
      squareNumber = adder;
      rowNumber++;

      // every 3 rows, increment square baseline
      if (rowNumber % 3 === 0) {
        adder = rowNumber;
        squareNumber = adder;
      }
    }
  });
},

/**
 * @index Number: row or column number to examine
 * @type string: "row", "column", or "square"
 *
 * Assumption: cellGroup can contain each value only ONCE
 *    Check which values already exist in the cellGroup
 *    Eliminate those values from the other cells in the group
 */
setPossibilities = ((index, type) => {
  const cellGroup = _.filter(cells, (cell) => {
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
});

// recursively narrow down possibilities to solution
solvePuzzle = () => {
  let runAgain = false;

  // rows and columns are 0-indexed
  const indices = _.map(allPossibilities, (p) => {
    return p - 1;
  });

  _.forEach(indices, (i) => {
    setPossibilities(i, SET_TYPE_ROW);
    setPossibilities(i, SET_TYPE_COLUMN);
    setPossibilities(i, SET_TYPE_SQUARE);
  });

  // set values for cells with only 1 possibility
  // runAgain if any cell has more than 1 possibility
  // throw error if cell has no value and 0 possibilities
  // console.log(cells, 'cells')
  // throw new Error('ff')
  _.forEach(cells, (cell) => {
    if (cell.possibilities.length == 1) {
      cell.value = _.first(cell.possibilities);
    } else if (cell.possibilities.length > 1) {
        runAgain = true;
    } else if (cell.possibilities.length == 0 && !cell.value) {
      throw new Error('Faulty puzzle: a cell has 0 possible values');
    }
  });

  if (runAgain) {
    solvePuzzle();
  }
},

createPuzzle();
solvePuzzle();
console.log(_.map(cells, 'value'), 'solution');


// TODO: let it solve 9x9 and later other sizes
// Incorporate the concept of squares.  For 3x3, for example, each sq would just be 1 cell, right?
// is the square size just the sq root of the side length?  like would a sudoku of 16 have sq size of 4x4?
// getting into the weeds here, but are all sudokus perfect squares?
// Incorporate an error for unsolvable puzzle
// Incorporate an error for less than the minimum number of clues (numbers shown here at https://en.wikipedia.org/wiki/Mathematics_of_Sudoku#Enumerating_all_possible_Sudoku_solutions)
// could I calculate thses minimums myself?  Not sure what goes into that calculation