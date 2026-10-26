const express = require('express');
const auth = require('../middleware/auth');
const Booking = require('../models/Booking');
const Showtime = require('../models/Showtime');

const router = express.Router();

// POST /api/bookings - create a booking (protected)
router.post('/', auth, async (req, res) => {
  try {
    const { showtimeId, seats } = req.body;

    if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({ message: 'Please provide showtimeId and at least one seat.' });
    }

    const showtime = await Showtime.findById(showtimeId);
    if (!showtime) {
      return res.status(404).json({ message: 'Showtime not found.' });
    }

    // Check if any requested seats are already booked
    const alreadyBooked = showtime.seats.filter(
      (s) => seats.includes(s.seatNumber) && s.isBooked
    );

    if (alreadyBooked.length > 0) {
      const bookedList = alreadyBooked.map((s) => s.seatNumber).join(', ');
      return res.status(400).json({
        message: `Seats already booked: ${bookedList}. Please select different seats.`
      });
    }

    // Atomically mark seats as booked
    showtime.seats.forEach((s) => {
      if (seats.includes(s.seatNumber)) {
        s.isBooked = true;
      }
    });
    await showtime.save();

    const totalAmount = seats.length * showtime.price;

    const booking = new Booking({
      user: req.user.id,
      showtime: showtime._id,
      seats,
      totalAmount,
      status: 'confirmed'
    });

    await booking.save();
    await booking.populate({
      path: 'showtime',
      populate: { path: 'movie', select: 'title poster genre duration' }
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to create booking.' });
  }
});

// GET /api/bookings/me - get current user's bookings (protected)
router.get('/me', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id })
      .populate({
        path: 'showtime',
        populate: { path: 'movie', select: 'title poster genre duration' }
      })
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to fetch user bookings.' });
  }
});

// DELETE /api/bookings/:id - cancel booking and release seats (protected)
router.delete('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, user: req.user.id });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled.' });
    }

    // Free up the seats in the showtime
    const showtime = await Showtime.findById(booking.showtime);
    if (showtime) {
      showtime.seats.forEach((s) => {
        if (booking.seats.includes(s.seatNumber)) {
          s.isBooked = false;
        }
      });
      await showtime.save();
    }

    booking.status = 'cancelled';
    await booking.save();

    res.json({ message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Failed to cancel booking.' });
  }
});

module.exports = router;
