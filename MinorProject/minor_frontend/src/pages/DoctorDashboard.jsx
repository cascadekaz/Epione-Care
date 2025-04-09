
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DoctorDashboard.css';
import Doctor1Image from '../assets/Dr-Desmond-Fang.png';
import Doctor2Image from '../assets/Dr-Laura-Profile-bio.png';
import Doctor3Image from '../assets/Dr-Krishnan-Rasaratnam.png';

const DoctorDashboard = () => {
  const [doctor, setDoctor] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    qualification: '',
    specialization: '',
    contact: '',
    availability: '',
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:8000/api/doctors/viewDashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const doc = res.data.data;
        setDoctor(doc);

        // Pre-fill form data
        setFormData({
          qualification: doc.qualification || '',
          specialization: doc.specialization || '',
          contact: doc.contact || '',
          availability: Array.isArray(doc.availability) ? doc.availability.join(', ') : '',
        });

      } catch (err) {
        setError(err.response?.data?.message || "Error loading dashboard");
      }
    };

    fetchDoctorData();
  }, []);

  const getDoctorImage = (name) => {
    if (name.includes("Desmond")) return Doctor1Image;
    if (name.includes("Laura")) return Doctor2Image;
    if (name.includes("Krishnan")) return Doctor3Image;
    return Doctor1Image;
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/users/update-profile", {
        ...formData,
        availability: (formData.availability || '').split(',').map(slot => slot.trim()),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  if (error) return <div className="error-message">{error}</div>;
  if (!doctor) return <div>Loading...</div>;

  const image = getDoctorImage(doctor.userId?.name || "");


  return (
    <div className="doctor-dashboard">
      <div className="doctor-title">
        <div className="doctor-image-container">
          <img
            src={image}
            alt={doctor.userId?.name}
            className="doctor-image"
          />
        </div>
        <div className="doctor-header">
          <h1>{doctor.userId?.name}</h1>
          <button className="view-bookings" onClick={() => navigate("/view-patients")}>VIEW PATIENTS</button>
          {editMode ? (
            <>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="Qualification"
              />
              <input
                type="text"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
                placeholder="Specialization"
              />
            </>
          ) : (
            <>
              <h2>{doctor.qualification}</h2>
              <h3>{doctor.specialization}</h3>
            </>
          )}
        </div>
      </div>

      <div className="doctor-details">
        <p><strong>Email:</strong> {doctor.userId?.email}</p>
        <p><strong>Contact:</strong></p>
        {editMode ? (
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
        ) : (
          <p>{doctor.contact || "Not provided"}</p>
        )}
        <p><strong>Availability:</strong></p>
        {editMode ? (
          <textarea
            name="availability"
            value={formData.availability}
            onChange={handleChange}
            placeholder="e.g., Monday 10am-2pm, Thursday 4pm-6pm"
            rows="2"
          />
        ) : (
          <ul>
            {doctor.availability?.map((slot, index) => (
              <li key={index}>{slot}</li>
            ))}
          </ul>
        )}
      </div>

      <div className="divider"></div>

      <div className="appointment-section">
        {editMode ? (
          <>
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="secondary-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="primary-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
          </>
        )}
        <p className="doctor-bio">
          This is your dashboard to manage appointments, view bookings, and update your availability.
        </p>
      </div>
    </div>
  );
};

export default DoctorDashboard;