import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

const SeatSelectionPage = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [infoMessage, setInfoMessage] = useState('');

  // Keep ref of selectedSeats for polling callback
  const selectedSeatsRef = useRef(selectedSeats);
  selectedSeatsRef.current = selectedSeats;

  const fetchShowtime = async (isInitial = false) => {
    try {
      const res = await api.get(`/showtimes/${showtimeId}`);
      setShowtime(res.data);

      // Check if any seat previously selected by user was booked by someone else in the meantime
      const newlyBooked = res.data.seats.filter(
        (s) => s.isBooked && selectedSeatsRef.current.includes(s.seatNumber)
      );

      if (newlyBooked.length > 0) {
        const bookedNums = newlyBooked.map((s) => s.seatNumber);
        setSelectedSeats((prev) => prev.filter((seat) => !bookedNums.includes(seat)));
        setInfoMessage(`Seat(s) ${bookedNums.join(', ')} were just reserved by another user.`);
      }
    } catch (err) {
      if (isInitial) {
        setError(err.response?.data?.message || 'Failed to load showtime details.');
      }
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtime(true);

    // Real-time polling every 3 seconds (E4 Task 12)
    const interval = setInterval(() => {
      fetchShowtime(false);
    }, 3000);

    return () => clearInterval(interval);
  }, [showtimeId]);

  const toggleSeat = (seatNumber, isBooked) => {
    if (isBooked) return;
    setError('');
    setInfoMessage('');

    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatNumber));
    } else {
      setSelectedSeats([...selectedSeats, seatNumber]);
    }
  };

  const handleBooking = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/showtimes/${showtimeId}/seats` } });
      return;
    }

    if (selectedSeats.length === 0) {
      setError('Please select at least one seat.');
      return;
    }

    try {
      setBookingLoading(true);
      setError('');
      const res = await api.post('/bookings', {
        showtimeId,
        seats: selectedSeats
      });

      navigate('/booking-confirmation', { state: { booking: res.data } });
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed.');
      fetchShowtime(false);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container text-center my-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading seat map...</p>
      </div>
    );
  }

  if (error && !showtime) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/" className="btn btn-outline-dark">Return to Home</Link>
      </div>
    );
  }

  const movie = showtime.movie;
  const showDate = new Date(showtime.dateTime).toLocaleString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const totalCost = selectedSeats.length * showtime.price;

  // Group seats by row
  const rows = ['A', 'B', 'C', 'D'];

  return (
    <div className="container py-4">
      <Link to={movie ? `/movies/${movie._id}` : '/'} className="btn btn-outline-secondary btn-sm mb-3">
        &larr; Back to Movie
      </Link>

      <div className="card shadow-sm border-0 mb-4">
        <div className="card-body">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h3 className="fw-bold mb-1">{movie?.title || 'Cinema'}</h3>
              <p className="text-muted mb-0">
                {showDate} &bull; <span className="badge bg-secondary">{showtime.screen}</span> &bull; ${showtime.price}/seat
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-3 mt-md-0">
              <span className="badge bg-success me-2">● Real-time Live</span>
            </div>
          </div>
        </div>
      </div>

      {infoMessage && <div className="alert alert-warning py-2">{infoMessage}</div>}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow-sm border-0 p-4 text-center">
            {/* Screen indicator */}
            <div className="mb-4">
              <div
                className="bg-dark text-white py-2 rounded-top mx-auto"
                style={{ width: '80%', letterSpacing: '4px' }}
              >
                SCREEN THIS WAY
              </div>
              <div
                className="border-bottom border-secondary mx-auto mb-4"
                style={{ width: '85%', height: '8px' }}
              ></div>
            </div>

            {/* Seat Map */}
            <div className="d-flex flex-column align-items-center gap-3">
              {rows.map((rowLetter) => {
                const rowSeats = showtime.seats.filter((s) => s.seatNumber.startsWith(rowLetter));
                return (
                  <div key={rowLetter} className="d-flex align-items-center gap-2">
                    <span className="fw-bold me-2 text-muted" style={{ width: '20px' }}>
                      {rowLetter}
                    </span>
                    {rowSeats.map((seat) => {
                      const isSelected = selectedSeats.includes(seat.seatNumber);
                      let btnClass = 'btn-outline-secondary';

                      if (seat.isBooked) {
                        btnClass = 'btn-danger disabled opacity-50';
                      } else if (isSelected) {
                        btnClass = 'btn-warning fw-bold';
                      } else {
                        btnClass = 'btn-outline-success';
                      }

                      return (
                        <button
                          key={seat.seatNumber}
                          type="button"
                          disabled={seat.isBooked}
                          onClick={() => toggleSeat(seat.seatNumber, seat.isBooked)}
                          className={`btn ${btnClass} seat-btn`}
                          style={{
                            width: '44px',
                            height: '42px',
                            fontSize: '0.8rem',
                            padding: '0'
                          }}
                        >
                          {seat.seatNumber}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Seat Legend */}
            <div className="d-flex justify-content-center gap-4 mt-5 small">
              <div className="d-flex align-items-center gap-1">
                <span className="badge bg-outline-success border border-success text-success">
                  &nbsp;
                </span>
                <span>Available</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span className="badge bg-warning">&nbsp;</span>
                <span>Selected</span>
              </div>
              <div className="d-flex align-items-center gap-1">
                <span className="badge bg-danger">&nbsp;</span>
                <span>Booked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Summary Box */}
        <div className="col-lg-4 mt-4 mt-lg-0">
          <div className="card shadow-sm border-0 sticky-top" style={{ top: '20px' }}>
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0">Booking Summary</h5>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="text-muted small">Selected Seats:</label>
                <div>
                  {selectedSeats.length > 0 ? (
                    selectedSeats.map((seat) => (
                      <span key={seat} className="badge bg-warning text-dark me-1 fs-6">
                        {seat}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted fst-italic">None selected yet</span>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-between py-2 border-top">
                <span>Tickets ({selectedSeats.length})</span>
                <span>${totalCost}</span>
              </div>

              <div className="d-flex justify-content-between py-2 border-top fw-bold fs-5">
                <span>Total</span>
                <span className="text-success">${totalCost}</span>
              </div>

              <button
                onClick={handleBooking}
                disabled={selectedSeats.length === 0 || bookingLoading}
                className="btn btn-warning w-100 mt-3 py-2 fw-bold"
              >
                {bookingLoading ? (
                  <span>Reserving...</span>
                ) : isAuthenticated ? (
                  `Confirm Booking ($${totalCost})`
                ) : (
                  'Login to Reserve'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatSelectionPage;
