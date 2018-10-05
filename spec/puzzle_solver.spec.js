const testPuzzles = require('./test_puzzles.json');
const PuzzleSolver = require('../puzzle_solver');
const _ = require('lodash');

// format puzzle input
const example9x9 = testPuzzles.solvable[0].puzzle.split('');
const parsedExample9x9 = _.map(example9x9, (e) => { return parseInt(e) })
const solution9x9 = testPuzzles.solvable[0].solution;

describe("Solver", () => {

  it("should solve a basic 9x9", () => {
    const solver = new PuzzleSolver(parsedExample9x9)
    const result = solver.solvePuzzle().join('');
    expect(result).toEqual(solution9x9);
  });

  it('should throw an error for non-square puzzles', () => {
    const solver = new PuzzleSolver(parsedExample9x9);
    // solver.createPuzzle(parsedExample9x9);
  });

  it('should throw an error for a puzzle side without square root', () => {

  })

  it('should throw an error for unsolvable puzzle', () => {

  });

  it('should throw an error for incorrect original puzzle', () => {

  });
});
