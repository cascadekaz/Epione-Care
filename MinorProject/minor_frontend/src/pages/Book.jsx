import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import axios from 'axios';
import './Book.css';

const Book = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/patients/doctors');
                setDoctors(response.data.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };
        fetchDoctors();
    }, []);

    const handleBookClick = (doctorId) => {
        navigate(`/book/${doctorId}`);
    };

    const filteredDoctors = doctors.filter((doc) =>
        doc.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="booking-page">
            <div className="booking-container">
                <h1 className="title">Book an appointment</h1>
                <input
                    type="text"
                    placeholder="Search Doctors..."
                    className="search-bar1"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="doctor-list">
                    {filteredDoctors.map((doctor) => (
                        <div key={doctor._id} className="doctor-card">
                            <div className="doctor-info">
                                <h3 className="doctor-name">{doctor.userId?.name}</h3>
                                <p className="doctor-qualifications">{doctor.qualification}</p>
                                <p className="doctor-specialization">{doctor.specialization || "Bio not available."}</p>
                                <button
                                    className="view-btn"
                                    onClick={() => handleBookClick(doctor._id)}
                                >
                                    Book Appointment
                                </button>
                                <p className="availability">
                                    Availability:<br />
                                    <strong>{doctor.availability?.join(', ')}</strong>
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Book;