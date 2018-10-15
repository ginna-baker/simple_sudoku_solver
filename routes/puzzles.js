const _ = require('lodash');
const express = require('express');
const router = express.Router();
const puzzles = require('../lib/puzzles.json');

/* GET a new puzzle, selected randomly from a json */
router.get('/', function(req, res, next) {
  const puzzle = _.sample(puzzles);
  console.log(puzzle, 'puzzle');
  res.json(puzzle);
});

module.exports = router;
