const testPuzzles = require('./test_puzzles.json');
const PuzzleSolver = require('../puzzle_solver');
const _ = require('lodash');

// format puzzle input
const example9x9 = testPuzzles.solvable[0].puzzle.split('');
const parsedExample9x9 = _.map(example9x9, (e) => { return parseInt(e); });
const solution9x9 = testPuzzles.solvable[0].solution;

describe("Solver", () => {

  it('should solve a basic 9x9', async () => {
    const solver = new PuzzleSolver(parsedExample9x9);
    const result = await solver.solvePuzzle().join('');
    expect(result).toEqual(solution9x9);
  });

  it('should throw an error for non-square puzzles', () => {
    const nonSquarePuzzle = testPuzzles.notSquare.puzzle.split('');
    const parsedNonSquarePuzzle = _.map(nonSquarePuzzle, (val) => { return parseInt(val); });

    expect( function(){ new PuzzleSolver(parsedNonSquarePuzzle); } ).toThrow(new Error('Wrong number of cells. Puzzle can\'t create squares.'));
  });

  it('should throw an error for a square puzzle whose side length has no square root', () => {
    const noSquareRootPuzzle = testPuzzles.noSquareRoot.puzzle.split('');
    const parsedNoSquareRootPuzzle = _.map(noSquareRootPuzzle, (val) => { return parseInt(val); });

    expect( function(){ new PuzzleSolver(parsedNoSquareRootPuzzle); } ).toThrow(new Error('Wrong number of cells. Puzzle can\'t create squares.'));
  });

  it('should throw an error for faulty original puzzle, ie 2 of the same number in a row', () => {
    const faultyPuzzle = testPuzzles.faultyValues.puzzle.split('');
    const parsedFaultyPuzzle = _.map(faultyPuzzle, (val) => { return parseInt(val); });
    const solver = new PuzzleSolver(parsedFaultyPuzzle);

    expect( function(){ solver.solvePuzzle(); } ).toThrow(new Error('Unsolvable: The original puzzle has wrong values.'));
  });
});
