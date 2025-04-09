const mongoose = require("mongoose");

const User = require("../Models/UserSchema");
const Doctor = require("../Models/DoctorSchema");
const Patient = require("../Models/PatientSchema");

exports.updateProfile = async (req, res) => {
    try {
        const { name, email, contact, specialization, qualification, age, gender, medicalHistory, availability, } = req.body;
        const user = await User.findById(req.user.id);


        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        if (user.role === "doctor") {
            console.log("Fetching doctor profile with userId:", user._id); // Debugging log

            let doctor = await Doctor.findOne({ userId: new mongoose.Types.ObjectId(user._id) });


            if (!doctor) {
                console.log("Doctor profile not found in DB");
                return res.status(404).json({ success: false, message: "Doctor profile not found" });
            }

            if (contact) doctor.contact = contact;
            if (specialization) doctor.specialization = specialization;
            if (qualification) doctor.qualification = qualification;
            if (availability) doctor.availability = availability;

            await doctor.save();
        } else if (user.role === "patient") {
            let patient = await Patient.findOne({ userId: user._id });

            if (!patient) {
                return res.status(404).json({ success: false, message: "Patient profile not found" });
            }

            if (contact) patient.contact = contact;
            if (age) patient.age = age;
            if (gender) patient.gender = gender;
            if (medicalHistory) patient.medicalHistory = medicalHistory;

            await patient.save();
        }
        await user.save();
        res.status(200).json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error });
    }
};
