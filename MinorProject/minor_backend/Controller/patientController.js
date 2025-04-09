const Doctor = require("../Models/DoctorSchema");
const Patient = require("../Models/PatientSchema");
const User = require("../Models/UserSchema");
const Booking = require("../Models/BookingSchema");
const PaymentService = require("../Services/paymentService");

exports.viewAllDoctors = async (req, res) => {
    try {

        const doctors = await Doctor.find()
            .populate({
                path: "userId",
                select: "name email -_id",
            });

        res.status(200).json({
            success: true,
            data: doctors,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.viewDoctorById = async (req, res) => {
    try {
        const { id } = req.params;

        const doctor = await Doctor.findById(id)
            .populate({
                path: "userId",
                select: "name email -_id",
            });

        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        res.status(200).json({
            success: true,
            data: doctor,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: error.message,
        });
    }
};

exports.viewDashboard = async (req, res) => {
    try {

        const patient = await Patient.findOne({ userId: req.user.id })
            .populate({
                path: "userId",
                select: "name email -_id",
            });

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient profile not found" });
        }

        res.status(200).json({ success: true, data: patient });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard",
            error: error.message,
        });
    }
};
const getDayName = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
};

// Helper: Parse "5PM" or "6 PM" etc. to 24-hour format
const parseTime = (time) => {
    time = time.trim().toUpperCase();
    let hour = parseInt(time.replace(/[^\d]/g, ''));
    if (time.includes('PM') && hour !== 12) hour += 12;
    if (time.includes('AM') && hour === 12) hour = 0;
    return hour;
};

exports.bookDoctor = async (req, res) => {
    try {
        const { doctorId, appointmentDate, timeSlot, paymentDetails } = req.body;

        console.log("Incoming booking request body:", req.body);

        if (!doctorId || !appointmentDate || !timeSlot) {
            return res.status(400).json({ success: false, message: "All fields (doctorId, appointmentDate, timeSlot) are required." });
        }

        const patient = await Patient.findOne({ userId: req.user.id });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient profile not found" });
        }

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor not found" });
        }

        // Get appointment day name (e.g., 'wednesday')
        const appointmentDay = getDayName(appointmentDate).toLowerCase();

        // Parse the user-selected time slot into 24-hour format
        const [slotStartTime, slotEndTime] = timeSlot.split('-').map(t => parseTime(t));

        // Check if the doctor is available on the selected day and time slot
        const isAvailable = doctor.availability.some(slot => {
            const [dayPart, timeRange] = slot.split(' ');
            if (!timeRange) return false;

            const [availStart, availEnd] = timeRange.split('-').map(t => parseTime(t));
            return dayPart.toLowerCase() === appointmentDay &&
                   slotStartTime >= availStart &&
                   slotEndTime <= availEnd;
        });

        if (!isAvailable) {
            return res.status(400).json({ success: false, message: "Doctor is not available at the selected time slot." });
        }

        // Check if the time slot is already booked
        const existingBooking = await Booking.findOne({
            doctorId,
            date: appointmentDate,
            timeSlot,
            status: { $ne: "cancelled" },
        });

        if (existingBooking) {
            return res.status(400).json({ success: false, message: "Time slot already booked, choose another slot." });
        }

        const paymentStatus = await PaymentService.processPayment(paymentDetails);

        if (!paymentStatus.success) {
            return res.status(400).json({ success: false, message: "Payment failed", error: paymentStatus.error });
        }

        const newBooking = new Booking({
            patientId: patient._id,
            doctorId: doctor._id,
            date: appointmentDate,
            timeSlot,
            status: "confirmed",
            paymentStatus: "completed",
            transactionId: paymentStatus.transactionId,
        });

        await newBooking.save();

        await Patient.findByIdAndUpdate(patient._id, {
            bookedDoctor: doctor._id,
        });

        await Doctor.findByIdAndUpdate(doctor._id, {
            $push: { patients: patient._id },
        });

        res.status(201).json({ success: true, message: "Booking successful", booking: newBooking });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error processing booking", error: error.message });
    }
};
exports.viewBookings = async (req, res) => {
    try {
        const patient = await Patient.findOne({ userId: req.user.id });
        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient profile not found" });
        }

        const bookings = await Booking.find({ patientId: patient._id })
            .populate("doctorId", "specialization qualification userId")
            .populate({
                path: "doctorId",
                populate: { path: "userId", select: "name email" },
            });

        if (bookings.length === 0) {
            return res.status(200).json({ success: true, message: "No bookings found", bookings: [] });
        }

        res.status(200).json({ success: true, bookings });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching bookings", error: error.message });
    }
};

