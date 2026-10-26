const express = require('express');
const Movie = require('../models/Movie');
const Showtime = require('../models/Showtime');

const router = express.Router();

// GET /api/movies - get all movies
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ createdAt: -1 });
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch movies.' });
  }
});

// GET /api/movies/:id - get movie by ID
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found.' });
    }
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch movie.' });
  }
});

// GET /api/movies/:id/showtimes - get showtimes for movie
router.get('/:id/showtimes', async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movie: req.params.id }).sort({ dateTime: 1 });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch showtimes.' });
  }
});

module.exports = router;
