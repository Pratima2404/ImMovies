const express = require('express');
const Showtime = require('../models/Showtime');

const router = express.Router();

// GET /api/showtimes/:id - get showtime with current seat availability
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id).populate('movie');
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found.' });
    }
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch showtime.' });
  }
});

// GET /api/showtimes/movie/:movieId - get showtimes for a specific movie
router.get('/movie/:movieId', async (req, res) => {
  try {
    const showtimes = await Showtime.find({ movie: req.params.movieId }).sort({ dateTime: 1 });
    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch showtimes.' });
  }
});

module.exports = router;
