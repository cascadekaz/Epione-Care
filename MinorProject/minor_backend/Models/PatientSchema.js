const mongoose = require("mongoose");

const PatientSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    age: { type: Number, default: null },
    gender: { type: String, default: "Not specified" },
    contact: { type: Number, default: "" },
    medicalHistory: { type: [String], default: [] },
    bookedDoctor: { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", default: null },
    reports: [
        {
          filename: String,
          path: String
        }
    ], 
    images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Patient", PatientSchema);
