import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/me');
      setBookings(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? This will release your seats.')) {
      return;
    }

    try {
      setActionLoading(bookingId);
      setError('');
      setMessage('');
      await api.delete(`/bookings/${bookingId}`);
      setMessage('Booking cancelled and seats released successfully.');
      fetchBookings();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">My Bookings</h2>

      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {bookings.length === 0 ? (
        <div className="card shadow-sm border-0 p-5 text-center">
          <h4>No bookings found</h4>
          <p className="text-muted">You have not booked any movie tickets yet.</p>
          <div>
            <Link to="/" className="btn btn-warning">
              Browse Movies
            </Link>
          </div>
        </div>
      ) : (
        <div className="row g-4">
          {bookings.map((booking) => {
            const showtime = booking.showtime;
            const movie = showtime?.movie;
            const showDate = showtime?.dateTime
              ? new Date(showtime.dateTime).toLocaleString(undefined, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })
              : 'N/A';

            const isCancelled = booking.status === 'cancelled';

            return (
              <div key={booking._id} className="col-md-6 col-lg-4">
                <div className={`card h-100 shadow-sm border-0 ${isCancelled ? 'opacity-75' : ''}`}>
                  <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
                    <span className="small text-truncate" style={{ maxWidth: '170px' }}>
                      ID: {booking._id.substring(booking._id.length - 8)}
                    </span>
                    <span
                      className={`badge ${
                        isCancelled ? 'bg-danger' : 'bg-success'
                      } text-uppercase`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title fw-bold">{movie?.title || 'Movie'}</h5>
                    <p className="text-muted small mb-2">📅 {showDate}</p>
                    <p className="text-muted small mb-2">📍 {showtime?.screen || 'Screen 1'}</p>
                    <div className="mb-2">
                      <span className="small text-muted">Seats: </span>
                      {booking.seats.map((seat) => (
                        <span key={seat} className="badge bg-secondary me-1">
                          {seat}
                        </span>
                      ))}
                    </div>
                    <p className="fw-bold text-success mb-3">Total: ${booking.totalAmount}</p>

                    {!isCancelled && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        disabled={actionLoading === booking._id}
                        className="btn btn-outline-danger btn-sm w-100"
                      >
                        {actionLoading === booking._id ? 'Cancelling...' : 'Cancel Booking'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookingsPage;
