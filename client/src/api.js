import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Built-in Demo Data & Storage for live standalone web demo
const initialMovies = [
  {
    _id: 'm1',
    title: 'Inception',
    description: 'A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a C.E.O.',
    genre: 'Sci-Fi / Action',
    duration: 148,
    poster: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600'
  },
  {
    _id: 'm2',
    title: 'Interstellar',
    description: 'When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot, Joseph Cooper, is tasked to pilot a spacecraft with a team of researchers.',
    genre: 'Sci-Fi / Adventure',
    duration: 169,
    poster: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=600'
  },
  {
    _id: 'm3',
    title: 'The Dark Knight',
    description: 'When the menace known as the Joker wreaks havoc and chaos on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability.',
    genre: 'Action / Crime',
    duration: 152,
    poster: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=600'
  },
  {
    _id: 'm4',
    title: 'Dune: Part Two',
    description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
    genre: 'Sci-Fi / Adventure',
    duration: 166,
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600'
  }
];

const generateSeats = () => {
  const rows = ['A', 'B', 'C', 'D'];
  const seats = [];
  rows.forEach((r) => {
    for (let i = 1; i <= 6; i++) {
      seats.push({ seatNumber: `${r}${i}`, isBooked: false });
    }
  });
  return seats;
};

const getDemoStore = () => {
  let showtimes = JSON.parse(localStorage.getItem('imovies_demo_showtimes') || 'null');
  let bookings = JSON.parse(localStorage.getItem('imovies_demo_bookings') || 'null');

  if (!showtimes) {
    const now = new Date();
    showtimes = [];
    initialMovies.forEach((m, idx) => {
      const s1 = generateSeats();
      s1[2].isBooked = true;
      s1[3].isBooked = true;
      showtimes.push({
        _id: `st_${idx}_1`,
        movie: m,
        dateTime: new Date(now.getTime() + 4 * 3600 * 1000).toISOString(),
        screen: 'IMAX Theater 1',
        price: 15,
        seats: s1
      });

      const s2 = generateSeats();
      s2[8].isBooked = true;
      showtimes.push({
        _id: `st_${idx}_2`,
        movie: m,
        dateTime: new Date(now.getTime() + 24 * 3600 * 1000).toISOString(),
        screen: 'Dolby Cinema 2',
        price: 12,
        seats: s2
      });
    });
    localStorage.setItem('imovies_demo_showtimes', JSON.stringify(showtimes));
  }

  if (!bookings) {
    bookings = [];
    localStorage.setItem('imovies_demo_bookings', JSON.stringify(bookings));
  }

  return { showtimes, bookings };
};

// Fallback interceptor when backend is offline
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { config } = error;
    if (!config) return Promise.reject(error);

    const url = config.url || '';
    const method = (config.method || 'get').toLowerCase();
    const { showtimes, bookings } = getDemoStore();

    // GET /movies
    if (method === 'get' && url === '/movies') {
      return Promise.resolve({ data: initialMovies });
    }

    // GET /movies/:id/showtimes
    if (method === 'get' && url.match(/^\/movies\/([^/]+)\/showtimes$/)) {
      const movieId = url.match(/^\/movies\/([^/]+)\/showtimes$/)[1];
      const filtered = showtimes.filter((s) => s.movie._id === movieId || s.movie === movieId);
      return Promise.resolve({ data: filtered });
    }

    // GET /movies/:id
    if (method === 'get' && url.match(/^\/movies\/([^/]+)$/)) {
      const id = url.match(/^\/movies\/([^/]+)$/)[1];
      const movie = initialMovies.find((m) => m._id === id) || initialMovies[0];
      return Promise.resolve({ data: movie });
    }

    // GET /showtimes/:id
    if (method === 'get' && url.match(/^\/showtimes\/([^/]+)$/)) {
      const id = url.match(/^\/showtimes\/([^/]+)$/)[1];
      const st = showtimes.find((s) => s._id === id) || showtimes[0];
      return Promise.resolve({ data: st });
    }

    // POST /auth/login
    if (method === 'post' && url === '/auth/login') {
      const data = JSON.parse(config.data || '{}');
      const user = { id: 'u1', name: data.email?.split('@')[0] || 'Demo User', email: data.email };
      return Promise.resolve({ data: { token: 'demo-jwt-token-xyz', user } });
    }

    // POST /auth/register
    if (method === 'post' && url === '/auth/register') {
      const data = JSON.parse(config.data || '{}');
      const user = { id: 'u1', name: data.name || 'Demo User', email: data.email };
      return Promise.resolve({ data: { token: 'demo-jwt-token-xyz', user } });
    }

    // POST /bookings
    if (method === 'post' && url === '/bookings') {
      const data = JSON.parse(config.data || '{}');
      const stIndex = showtimes.findIndex((s) => s._id === data.showtimeId);
      const st = stIndex >= 0 ? showtimes[stIndex] : showtimes[0];

      data.seats.forEach((seatNum) => {
        const found = st.seats.find((s) => s.seatNumber === seatNum);
        if (found) found.isBooked = true;
      });
      localStorage.setItem('imovies_demo_showtimes', JSON.stringify(showtimes));

      const newBooking = {
        _id: 'bk_' + Date.now(),
        showtime: st,
        seats: data.seats,
        totalAmount: data.seats.length * st.price,
        status: 'confirmed',
        createdAt: new Date().toISOString()
      };
      bookings.unshift(newBooking);
      localStorage.setItem('imovies_demo_bookings', JSON.stringify(bookings));
      return Promise.resolve({ data: newBooking });
    }

    // GET /bookings/me
    if (method === 'get' && url === '/bookings/me') {
      return Promise.resolve({ data: bookings });
    }

    // DELETE /bookings/:id
    if (method === 'delete' && url.match(/^\/bookings\/([^/]+)$/)) {
      const id = url.match(/^\/bookings\/([^/]+)$/)[1];
      const bIndex = bookings.findIndex((b) => b._id === id);
      if (bIndex >= 0) {
        bookings[bIndex].status = 'cancelled';
        const stIndex = showtimes.findIndex((s) => s._id === bookings[bIndex].showtime._id);
        if (stIndex >= 0) {
          bookings[bIndex].seats.forEach((seatNum) => {
            const found = showtimes[stIndex].seats.find((s) => s.seatNumber === seatNum);
            if (found) found.isBooked = false;
          });
          localStorage.setItem('imovies_demo_showtimes', JSON.stringify(showtimes));
        }
        localStorage.setItem('imovies_demo_bookings', JSON.stringify(bookings));
      }
      return Promise.resolve({ data: { message: 'Booking cancelled successfully.' } });
    }

    return Promise.reject(error);
  }
);

export default api;
