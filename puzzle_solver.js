// TO RUN THE PUZZLE SOLVER:
// On the command line,
// node puzzle_solver --starter=value,value,etc
// Note: all empty squares must have undefined or null

const _ = require('lodash');
const minimist = require('minimist');

const args = minimist(process.argv.slice(2));
const example1 = [
  undefined, undefined, undefined,
  undefined, 2, undefined,
  undefined, undefined, 3,
];

const SET_TYPE_ROW = 'row';
const SET_TYPE_COLUMN = 'column';
// const SET_TYPE_SQUARE = 'square';

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
    return cell[type] == index;
  });

  // get all values that already exist in that row
  const numsToEliminate = _.map(
    _.filter(cellGroup, (cell) => {
      return !_.isNil(cell.value);
    }), 'value');

  // narrow down cell possibilities by removing numbers already in the row
  _.forEach(cellGroup, (cell) => {
    if (_.isNil(cell.value)) {
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
    // setPossibilities(i, SET_TYPE_SQUARE)
  });

  // set values for cells with only 1 possibility
  // runAgain if any cell has more than 1 possibility
  // throw error if cell has no value and 0 possibilities
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