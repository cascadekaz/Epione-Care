import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './BookForm.css';

const BookForm = () => {
    const { doctorId } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [appointmentDate, setAppointmentDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/patients/doctor/${doctorId}`);
                setDoctor(res.data.data);
            } catch (err) {
                console.error('Doctor fetch error:', err);
            }
        };
        fetchDoctor();
    }, [doctorId]);

    const handleBooking = async () => {
        if (!appointmentDate || !timeSlot || !paymentDetails.cardNumber || !paymentDetails.expiry || !paymentDetails.cvv) {
            alert('Please fill in all fields!');
            return;
        }

        try {
            console.log("Sending booking data:", {
                doctorId,
                appointmentDate,
                timeSlot,
                paymentDetails
            });
            const res = await axios.post(`http://localhost:8000/api/patients/book`, {
                doctorId,
                appointmentDate,
                timeSlot,
                paymentDetails,
            }, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            console.log("Booking response:", res);


            if (res.data.success) {
                alert("Appointment booked successfully!");
            } else {
                alert(res.data.message);
            }
        } catch (err) {
            console.error("Booking error:", err);
            console.error("Error response data:", err.response?.data);
            console.error("Error status:", err.response?.status);
            console.error("Error headers:", err.response?.headers);
            alert(err.response?.data?.message || "Booking failed.");
        }
    };

    return (
        <div className="booking-form-page">
            {doctor ? (
                <div className="booking-form">
                    <h2>Book Appointment with {doctor.userId?.name}</h2>

                    <label>Date:</label>
                    <input
                        type="date"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                    />

                    <label>Time Slot:</label>
                    <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)}>
                        <option value="">Select Time Slot</option>
                        <option value="9AM - 10AM">9AM - 10AM</option>
                        <option value="10AM - 11AM">10AM - 11AM</option>
                        <option value="11AM - 12PM">11AM - 12PM</option>
                        <option value="12PM - 1PM">12PM - 1PM</option>
                        <option value="1PM - 2PM">1PM - 2PM</option>
                        <option value="2PM - 3PM">2PM - 3PM</option>
                        <option value="3PM - 4PM">3PM - 4PM</option>
                        <option value="4PM - 5PM">4PM - 5PM</option>
                        <option value="5PM - 6PM">5PM - 6PM</option>
                        <option value="6PM - 7PM">6PM - 7PM</option>
                        <option value="7PM - 8PM">7PM - 8PM</option>
                        <option value="8PM - 9PM">8PM - 9PM</option>
                        <option value="9PM - 10PM">9PM - 10PM</option>
                    </select>

                    <h4>Payment Details</h4>
                    <input
                        type="text"
                        placeholder="Card Number"
                        value={paymentDetails.cardNumber}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Expiry (MM/YY)"
                        value={paymentDetails.expiry}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="CVV"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                    />

                    <button className="confirm-btn" onClick={handleBooking}>
                        Confirm Booking & Pay
                    </button>
                </div>
            ) : (
                <p>Loading doctor info...</p>
            )}
        </div>
    );
};

export default BookForm;
