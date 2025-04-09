import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ViewPatients.css';

const ViewPatients = () => {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem("token");
                const res = await axios.get("http://localhost:8000/api/doctors/getPatients", {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const patientList = res.data.patients || [];
                setPatients(patientList);
                setFilteredPatients(patientList);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to fetch patients");
            }
        };

        fetchPatients();
    }, []);

    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearchTerm(value);
        const filtered = patients.filter(patient =>
            patient.name.toLowerCase().includes(value)
        );
        setFilteredPatients(filtered);
    };

    const handleAnalyze = (patientId) => {
        // Navigate to analysis page or trigger an action
        navigate(`/analyze/${patientId}`);
    };

    return (
        <div className="view-patients-container">
            <div className="view-patients-header">
                <h1>Your Patients</h1>
                <button onClick={() => navigate(-1)} className="back-button">
                    ⬅ Back
                </button>
            </div>

            <input
                type="text"
                placeholder="Search by patient name..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-bar"
            />

            {error && <div className="error">{error}</div>}

            {filteredPatients.length === 0 ? (
                <div className="no-results">No matching patients found.</div>
            ) : (
                <div className="table-wrapper">
                    <table className="patients-table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Age</th>
                                <th>Gender</th>
                                <th>Phone Number</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPatients.map((patient) => (
                                <tr key={patient._id}>
                                    <td>{patient.name}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.age}</td>
                                    <td>{patient.gender}</td>
                                    <td>{patient.phoneNumber}</td>
                                    <td>
                                        <button
                                            className="analyze-button"
                                            onClick={() => handleAnalyze(patient._id)}
                                        >
                                            Analyze
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewPatients;
