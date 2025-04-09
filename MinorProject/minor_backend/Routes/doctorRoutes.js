const express = require("express");
const router = express.Router();
const DoctorController = require("../Controller/doctorController");
const authMiddleware = require("../Middleware/authMiddleware");
const upload = require("../multerConfig");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const FormData = require("form-data");
const Patient = require("../Models/PatientSchema");

router.get("/getPatients", authMiddleware, DoctorController.getDoctorPatients);
router.get("/viewDashboard", authMiddleware, DoctorController.viewDashboard);

router.post("/uploadImage/:patientId", authMiddleware, upload.single("image"), DoctorController.uploadPatientImage);
router.post("/analyzeImage", authMiddleware, DoctorController.analyzePatientImage);

module.exports = router;
