import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewBookings.css'

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/patients/dashboard", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const patientId = res.data.data._id;

                const bookingsRes = await axios.get(`http://localhost:8000/api/patients/bookings/${patientId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setBookings(bookingsRes.data.bookings);
            } catch (err) {
                console.error("Failed to load bookings:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <div>Loading bookings...</div>;

    return (
        <div className="view-bookings">
            <h2>Your Bookings</h2>
            {bookings.length === 0 ? (
                <p>No bookings found.</p>
            ) : (
                <ul className="booking-list">
                    {bookings.map((booking, idx) => (
                        <li key={idx} className="booking-card">
                            <p><strong>Date:</strong> {new Date(booking.date).toLocaleDateString()}</p>
                            <p><strong>Time:</strong> {booking.timeSlot}</p>
                            <p><strong>Doctor:</strong> {booking.doctorId?.userId?.name || 'N/A'}</p>
                            <p><strong>Specialization:</strong> {booking.doctorId?.specialization || 'N/A'}</p>
                            <p><strong>Qualification:</strong> {booking.doctorId?.qualification || 'N/A'}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ViewBookings;
