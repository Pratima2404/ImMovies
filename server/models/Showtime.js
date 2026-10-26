const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema(
  {
    seatNumber: {
      type: String,
      required: true
    },
    isBooked: {
      type: Boolean,
      default: false
    }
  },
  { _id: false }
);

const showtimeSchema = new mongoose.Schema(
  {
    movie: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Movie',
      required: true
    },
    dateTime: {
      type: Date,
      required: true
    },
    screen: {
      type: String,
      default: 'Screen 1'
    },
    price: {
      type: Number,
      required: true,
      default: 12
    },
    seats: [seatSchema]
  },
  { timestamps: true }
);

// Helper function to generate default 24 seats (A1-A6, B1-B6, C1-C6, D1-D6)
showtimeSchema.statics.generateDefaultSeats = function () {
  const rows = ['A', 'B', 'C', 'D'];
  const seats = [];
  rows.forEach((row) => {
    for (let i = 1; i <= 6; i++) {
      seats.push({ seatNumber: `${row}${i}`, isBooked: false });
    }
  });
  return seats;
};

module.exports = mongoose.model('Showtime', showtimeSchema);
