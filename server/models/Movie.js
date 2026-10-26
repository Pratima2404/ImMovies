const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    genre: {
      type: String,
      required: [true, 'Genre is required']
    },
    duration: {
      type: Number,
      required: [true, 'Duration in minutes is required']
    },
    poster: {
      type: String,
      default: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Movie', movieSchema);
