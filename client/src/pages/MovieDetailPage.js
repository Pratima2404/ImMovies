import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';

const MovieDetailPage = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          api.get(`/movies/${id}`),
          api.get(`/movies/${id}/showtimes`)
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load movie details.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error || 'Movie not found.'}</div>
        <Link to="/" className="btn btn-outline-dark">Back to Movies</Link>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <Link to="/" className="btn btn-outline-secondary btn-sm mb-4">
        &larr; Back to Movies
      </Link>

      <div className="row g-4 mb-5">
        <div className="col-md-4">
          <img
            src={movie.poster}
            alt={movie.title}
            className="img-fluid rounded shadow-sm w-100"
            style={{ maxHeight: '450px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-8">
          <h1 className="fw-bold">{movie.title}</h1>
          <div className="mb-3">
            <span className="badge bg-warning text-dark me-2">{movie.genre}</span>
            <span className="badge bg-secondary">⏱ {movie.duration} mins</span>
          </div>
          <h5 className="mt-4 fw-semibold">Synopsis</h5>
          <p className="lead fs-6 text-muted">{movie.description}</p>
        </div>
      </div>

      <div className="card shadow-sm border-0">
        <div className="card-header bg-dark text-white py-3">
          <h5 className="mb-0">Select a Showtime</h5>
        </div>
        <div className="card-body p-4">
          {showtimes.length === 0 ? (
            <p className="text-muted mb-0">No showtimes scheduled yet for this movie.</p>
          ) : (
            <div className="row row-cols-1 row-cols-md-3 g-3">
              {showtimes.map((st) => {
                const dateObj = new Date(st.dateTime);
                const formattedDate = dateObj.toLocaleDateString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric'
                });
                const formattedTime = dateObj.toLocaleTimeString(undefined, {
                  hour: '2-digit',
                  minute: '2-digit'
                });

                const availableSeatsCount = st.seats?.filter((s) => !s.isBooked).length || 0;

                return (
                  <div key={st._id} className="col">
                    <div className="card h-100 border p-3">
                      <div className="d-flex justify-content-between">
                        <span className="fw-bold">{formattedDate}</span>
                        <span className="badge bg-info text-dark">{st.screen}</span>
                      </div>
                      <h4 className="text-primary my-2">{formattedTime}</h4>
                      <p className="text-muted small mb-2">Price: ${st.price}</p>
                      <p className="text-muted small mb-3">
                        Available: <strong>{availableSeatsCount}</strong> / {st.seats?.length || 24}
                      </p>
                      <Link
                        to={`/showtimes/${st._id}/seats`}
                        className="btn btn-warning btn-sm mt-auto fw-semibold"
                      >
                        Choose Seats
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetailPage;
