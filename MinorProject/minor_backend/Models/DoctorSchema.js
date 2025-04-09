const mongoose = require("mongoose");

const DoctorSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    specialization: { type: String, default: "General Practitioner" },
    qualification: { type: String, default: "NotSpecified" },
    contact: { type: Number, default: "" },
    availability: { type: [String], default: [] }, //MONday 10am -2pm
    patients: [{ type: mongoose.Schema.Types.ObjectId, ref: "Patient" }],
}, { timestamps: true });

module.exports = mongoose.model("Doctor", DoctorSchema);
