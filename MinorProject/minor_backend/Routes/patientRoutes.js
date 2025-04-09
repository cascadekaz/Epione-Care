const express = require("express");
const router = express.Router();
const patientController = require("../Controller/patientController");
const authMiddleware = require("../Middleware/authMiddleware");

router.get("/doctors", patientController.viewAllDoctors);
router.get("/doctor/:id", patientController.viewDoctorById);
router.get("/dashboard", authMiddleware, patientController.viewDashboard);
router.get("/bookings/:patientId", authMiddleware, patientController.viewBookings);
router.post("/book", authMiddleware, patientController.bookDoctor);

module.exports = router;
