import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await api.get('/movies');
        setMovies(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movies.');
      } finally {
        setLoading(false);
      }
    };
    fetchMovies();
  }, []);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading movies...</p>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="p-4 mb-4 bg-dark text-white rounded-3 shadow-sm text-center">
        <h1 className="fw-bold">Now Showing at IMovies</h1>
        <p className="lead mb-0 text-secondary">
          Experience cinema like never before. Pick your favorite seats with real-time reservation.
        </p>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4">
        {movies.map((movie) => (
          <div key={movie._id} className="col">
            <div className="card h-100 shadow-sm border-0">
              <img
                src={movie.poster}
                className="card-img-top"
                alt={movie.title}
                style={{ height: '320px', objectFit: 'cover' }}
              />
              <div className="card-body d-flex flex-column">
                <span className="badge bg-secondary mb-2 align-self-start">{movie.genre}</span>
                <h5 className="card-title fw-bold">{movie.title}</h5>
                <p className="card-text text-muted small flex-grow-1">
                  {movie.description?.length > 90
                    ? `${movie.description.substring(0, 90)}...`
                    : movie.description}
                </p>
                <div className="d-flex justify-content-between align-items-center mt-3">
                  <span className="small text-muted">⏱ {movie.duration} mins</span>
                  <Link to={`/movies/${movie._id}`} className="btn btn-warning btn-sm fw-semibold">
                    Showtimes
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
