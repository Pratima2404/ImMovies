import React from 'react';
import { useLocation, Link } from 'react-router-dom';

const BookingConfirmationPage = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="container py-5 text-center">
        <h3>No booking details found.</h3>
        <Link to="/" className="btn btn-warning mt-3">
          Explore Movies
        </Link>
      </div>
    );
  }

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
    : '';

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 text-center p-4">
            <div className="mb-3">
              <span className="badge bg-success rounded-circle p-3 fs-3">✓</span>
            </div>
            <h2 className="fw-bold text-success mb-1">Booking Confirmed!</h2>
            <p className="text-muted">Your seats have been successfully reserved.</p>

            <div className="card bg-light border-0 my-4 text-start p-3">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Booking ID:</span>
                <span className="fw-monospace small">{booking._id}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Movie:</span>
                <span className="fw-bold">{movie?.title || 'IMovies Feature'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Date & Time:</span>
                <span>{showDate}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Screen:</span>
                <span>{showtime?.screen || 'Main Screen'}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted small">Reserved Seats:</span>
                <span className="fw-bold text-primary">{booking.seats.join(', ')}</span>
              </div>
              <div className="d-flex justify-content-between border-top pt-2">
                <span className="fw-bold">Total Paid:</span>
                <span className="fw-bold text-success">${booking.totalAmount}</span>
              </div>
            </div>

            <div className="d-flex gap-2 justify-content-center">
              <Link to="/my-bookings" className="btn btn-outline-dark">
                View All My Bookings
              </Link>
              <Link to="/" className="btn btn-warning">
                Book Another Movie
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
