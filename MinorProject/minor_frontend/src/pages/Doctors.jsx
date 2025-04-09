import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Doctors.css';

import Doctor1Image from '../assets/Dr-Desmond-Fang.png';
// import Doctor2Image from '../assets/Dr-Laura-Profile-bio.png';
import Doctor2Image from '../assets/Dr-Krishnan-Rasaratnam.png';

const Doctors = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);

  const doctorImages = [Doctor1Image, Doctor2Image]; // Map images by order

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/patients/doctors');
        const doctorsFromDB = response.data.data;

        // Combine backend data with static images
        const doctorsWithImages = doctorsFromDB.map((doc, index) => ({
          ...doc,
          image: doctorImages[index] || Doctor1Image, // fallback to default
        }));

        setDoctors(doctorsWithImages);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };

    fetchDoctors();
  }, []);

  const handleReadMore = (id) => {
    navigate(`/doctor/${id}`);
  };

  return (
    <div className="doctors-page">
      <h1>Our Doctors</h1>
      <div className="doctors-container">
        {doctors.map((doctor, index) => (
          <div key={doctor._id || index} className="doctor-card">
            <div className="doctor-image-container">
              <img
                src={doctor.image}
                alt={doctor.userId.name}
                className="doctor-image"
              />
            </div>
            <h2 className="doctor-name">{doctor.userId.name}</h2>
            <p className="doctor-speciality">{doctor.specialization || 'General Practitioner'}</p>
            <button
              onClick={() => handleReadMore(doctor._id)}
              className="read-more"
            >
              READ MORE
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Doctors;