require('dotenv').config();
const mongoose = require('mongoose');
const Movie = require('./models/Movie');
const Showtime = require('./models/Showtime');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/imovies';

const moviesData = [
  {
    title: 'Inception',
    description: 'A thief who steals corporate secrets through the use of dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi / Action',
    duration: 148,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600'
  },
  {
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft along with a team of researchers.',
    genre: 'Sci-Fi / Adventure',
    duration: 169,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600'
  },
  {
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability.',
    genre: 'Action / Crime',
    duration: 152,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600'
  },
  {
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi / Adventure',
    duration: 166,
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600'
  }
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB for seeding');

    await Movie.deleteMany({});
    await Showtime.deleteMany({});

    const createdMovies = await Movie.insertMany(moviesData);
    console.log(`Seeded ${createdMovies.length} movies`);

    const showtimes = [];
    const now = new Date();

    createdMovies.forEach((movie) => {
      // Create 2 showtimes per movie (today evening and tomorrow)
      const slot1 = new Date(now.getTime() + 4 * 60 * 60 * 1000);
      const slot2 = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      const seats1 = Showtime.generateDefaultSeats();
      // Book a few random seats for realism
      seats1[2].isBooked = true; // A3
      seats1[3].isBooked = true; // A4

      showtimes.push({
        movie: movie._id,
        dateTime: slot1,
        screen: 'IMAX Theater 1',
        price: 15,
        seats: seats1
      });

      const seats2 = Showtime.generateDefaultSeats();
      seats2[8].isBooked = true; // B3

      showtimes.push({
        movie: movie._id,
        dateTime: slot2,
        screen: 'Dolby Cinema 2',
        price: 12,
        seats: seats2
      });
    });

    await Showtime.insertMany(showtimes);
    console.log(`Seeded ${showtimes.length} showtimes`);

    console.log('Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
