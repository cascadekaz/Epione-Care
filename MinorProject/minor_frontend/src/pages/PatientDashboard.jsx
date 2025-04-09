import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [patient, setPatient] = useState(null);
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatientDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/patients/dashboard", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data.data.userId);
        setPatient(response.data.data);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientDetails();
  }, []);


  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:8000/api/users/update-profile", {
        name: user.name,
        email: user.email,
        age: patient.age,
        gender: patient.gender,
        contact: patient.contact,
        medicalHistory: patient.medicalHistory,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setEditMode(false);
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  if (!patient || !user) return <div>Loading...</div>
  return (
    <div className="patient-dashboard">
      <div className="patient-header">
        <h1>Patient Dashboard</h1>
        <div className="patient-basic-info">
          <div className="patient-avatar">
            <div className="avatar-placeholder">{user.name.charAt(0)}</div>
          </div>
          <div className="patient-details">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={user.name}
                  onChange={(e) => setUser({ ...user, name: e.target.value })}
                />
                <input
                  type="number"
                  value={patient.age}
                  onChange={(e) => setPatient({ ...patient, age: e.target.value })}
                />
                <select
                  value={patient.gender}
                  onChange={(e) => setPatient({ ...patient, gender: e.target.value })}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </>
            ) : (
              <>
                <h2>{user.name}</h2>
                <p><strong>Age:</strong> {patient.age || 'N/A'} years</p>
                <p><strong>Gender:</strong> {patient.gender}</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="patient-contact-info">
        <h3>Contact Information</h3>
        {editMode ? (
          <>
            <input
              type="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
            <input
              type="tel"
              value={patient.contact}
              onChange={(e) => setPatient({ ...patient, contact: e.target.value })}
            />
          </>
        ) : (
          <>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {patient.contact || 'N/A'}</p>
          </>
        )}
      </div>

      <div className="patient-medical-info">
        <div className="info-card">
          <h3>Medical History</h3>
          {editMode ? (
            <textarea
              value={patient.medicalHistory.join('\n')}
              onChange={(e) =>
                setPatient({
                  ...patient,
                  medicalHistory: e.target.value.split('\n'),
                })
              }
              rows={4}
            />
          ) : (
            <ul>
              {patient.medicalHistory?.length > 0 ? (
                patient.medicalHistory.map((item, index) => (
                  <li key={index}>{item}</li>
                ))
              ) : (
                <li>No medical history available</li>
              )}
            </ul>
          )}
        </div>

        <div className="info-card">
          <h3>Vital Statistics</h3>
          <p><strong>Blood Type:</strong>B+ve</p>
          <p><strong>Last Appointment:</strong>2025-03-29</p>
          <p><strong>Next Appointment:</strong>2025-04-10</p>
        </div>

        <div className="info-card">
          <h3>Previous Reports</h3>
          {patient.reports?.length > 0 ? (
            <ul>
              {patient.reports.map((report, index) => (
                <li key={index} style={{ marginBottom: '10px' }}>
                  Report {index + 1}:&nbsp;
                  <a
                    href={`http://localhost:8000/${report.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="download-link"
                  >
                    {report.filename}
                  </a>
                  <a
                    href={`http://localhost:8000/${report.path}`}
                    download
                    className="download-button"
                    style={{
                      marginLeft: '10px',
                      background: '#2980b9',
                      color: '#fff',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      textDecoration: 'none',
                    }}
                  >
                    Download
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p>No reports available</p>
          )}
        </div>

      </div>
      <div className="patient-actions">
        {editMode ? (
          <>
            <button className="primary-btn" onClick={handleSave}>Save</button>
            <button className="secondary-btn" onClick={() => setEditMode(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="primary-btn" onClick={() => navigate('/book-now')}>Schedule Appointment</button>
            <button className="secondary-btn" onClick={() => setEditMode(true)}>Edit Profile</button>
            <button className="secondary-btn" onClick={() => navigate('/view-bookings')}>View Bookings</button>
          </>
        )}
      </div>
    </div>
  );
};

export default PatientDashboard;