
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Body from "./components/Body";
import Aboutus from "./pages/Aboutus";
import Doctors from "./pages/Doctors";
import Footer from "./components/Footer";
import Login from './pages/Login';
import Signup from "./pages/Signup"; // Add this line
import Book from './pages/Book';
import BookForm from './pages/BookForm';
// import AddPatient from "./pages/AddPatient";
import DoctorDashboard from "./pages/DoctorDashboard";
import PatientDashboard from "./pages/PatientDashboard";
import ViewBookings from "./pages/ViewBookings";
import DoctorDetails from "./pages/DoctorDetails";
import ViewPatients from "./pages/ViewPatients";
import AnalyzePatient from "./pages/AnalyzePatient";

import "./index.css"; // Ensuring global styles are included

const App = () => {
  return (
    <Router>
      <Navbar />
      {/* <Body/> */}
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/aboutus" element={<Aboutus />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/book-now" element={<Book />} />
        {/* <Route path="/add-patient" element={<AddPatient />} /> */}
        <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
        <Route path="/patient-dashboard" element={<PatientDashboard />} />
        <Route path="/view-bookings" element={<ViewBookings />} />
        <Route path="/view-patients" element={<ViewPatients />} />
        <Route path="/doctor/:id" element={<DoctorDetails />} />
        <Route path="/book/:doctorId" element={<BookForm />} />
        <Route path="/analyze/:patientId" element={<AnalyzePatient />} />

      </Routes>
      <Footer />
    </Router>
  );
};

export default App;