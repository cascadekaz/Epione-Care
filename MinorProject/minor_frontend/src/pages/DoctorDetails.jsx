
// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import axios from 'axios';
// import "./DoctorDetails.css";

// import Doctor1Image from '../assets/Dr-Desmond-Fang.png';
// // import Doctor2Image from '../assets/Dr-Laura-Profile-bio.png';
// import Doctor2Image from '../assets/Dr-Krishnan-Rasaratnam.png';

// const doctorImages = [Doctor1Image, Doctor2Image];

// const DoctorDetails = () => {
//     const { id } = useParams();
//     const [doctor, setDoctor] = useState(null);
//     const [image, setImage] = useState(Doctor1Image); // default

//     useEffect(() => {
//         const fetchDoctor = async () => {
//             try {
//                 const res = await axios.get(`http://localhost:8000/api/patients/doctor/${id}`);
//                 setDoctor(res.data.data);
//                 // const index = res.data.data.__v % doctorImages.length;
//                 // setImage(doctorImages[index]);
//                 const index = res.data.data.__v % doctorImages.length;
//                 setImage(doctorImages[index]);


//             } catch (err) {
//                 console.error("Error fetching doctor:", err);
//             }
            
//         };

//         fetchDoctor();
//     }, [id]);

//     if (!doctor) return <div>Loading...</div>;

//     return (
//         <div className="doctor-details-page">
//             <h1>{doctor.userId.name}</h1>
//             <img src={image} alt={doctor.userId.name} className="doctor-image" />
//             <p><strong>Email:</strong> {doctor.userId.email}</p>
//             <p><strong>Specialization:</strong> {doctor.specialization || "General Practitioner"}</p>
//             <p><strong>Qualification</strong> {doctor.qualification || "Will be updated soon"}</p>
//             <p><strong>Contact:</strong> {doctor.contact || "N/A"}</p>
//             <div>
//                 <strong>Availability:</strong>
//                 <ul>
//                     {doctor.availability && doctor.availability.length > 0 ? (
//                         doctor.availability.map((slot, index) => (
//                             <li key={index}>{slot}</li>
//                         ))
//                     ) : (
//                         <li>No availability information</li>
//                     )}
//                 </ul>
//             </div>
//         </div>
//     );
// };

// export default DoctorDetails;

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "./DoctorDetails.css";

import Doctor1Image from '../assets/Dr-Desmond-Fang.png';
import Doctor2Image from '../assets/Dr-Krishnan-Rasaratnam.png';

// Map specific doctor IDs to images
const doctorImagesMap = {
    "67e823d6aa6b2315699f81a4": Doctor1Image,
    "67f21d8ce1c1beed7d77df11": Doctor2Image,
};

const DoctorDetails = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState(null);
    const [image, setImage] = useState(Doctor1Image); // default

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/patients/doctor/${id}`);
                setDoctor(res.data.data);
                setImage(doctorImagesMap[id] || Doctor1Image); // fallback to default if id not found
            } catch (err) {
                console.error("Error fetching doctor:", err);
            }
        };

        fetchDoctor();
    }, [id]);

    if (!doctor) return <div>Loading...</div>;

    return (
        <div className="doctor-details-page">
            <h1>{doctor.userId.name}</h1>
            <img src={image} alt={doctor.userId.name} className="doctor-image" />
            <p><strong>Email:</strong> {doctor.userId.email}</p>
            <p><strong>Specialization:</strong> {doctor.specialization || "General Practitioner"}</p>
            <p><strong>Qualification</strong> {doctor.qualification || "Will be updated soon"}</p>
            <p><strong>Contact:</strong> {doctor.contact || "N/A"}</p>
            <div>
                <strong>Availability:</strong>
                <ul>
                    {doctor.availability && doctor.availability.length > 0 ? (
                        doctor.availability.map((slot, index) => (
                            <li key={index}>{slot}</li>
                        ))
                    ) : (
                        <li>No availability information</li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default DoctorDetails;

