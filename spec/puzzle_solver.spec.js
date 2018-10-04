const testPuzzle = require('./test_puzzles.json');
const solver = require('../puzzle_solver');
const _ = require('lodash');

const example9x9 = testPuzzle[0].puzzle.split('')
const parsedExample9x9 = _.map(example9x9, (e) => { return parseInt(e) })

describe("Solver", () => {

  it("should solve a basic 9x9", () => {
    // format puzzle input
    const example = testPuzzle[0].puzzle.split('');
    const example1 = _.map(example, (e) => { return parseInt(e) })

    solver.createPuzzle(parsedExample9x9);
    const solution = solver.solvePuzzle().join('');

    expect(solution).toEqual(testPuzzle[0].solution);
  });

  it('should throw an error for non-square puzzles', () => {

  });

  it('should throw an error for a puzzle side without square root', () => {

  })

  it('should throw an error for unsolvable puzzle', () => {

  });

  it('should throw an error for incorrect original puzzle', () => {

  });
});
