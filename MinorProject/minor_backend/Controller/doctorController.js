const fs = require('fs');
const axios = require('axios');
const FormData = require('form-data');
const User = require("../Models/UserSchema");
const Patient = require("../Models/PatientSchema");
const Doctor = require("../Models/DoctorSchema");
const PDFDocument = require('pdfkit');
const path = require('path');

exports.getDoctorPatients = async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user.id }).populate({
            path: "patients",
            select: "age gender contact",
            populate: {
                path: "userId",
                select: "name email",
            }
        });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found" });
        }

        if (!doctor.patients || doctor.patients.length === 0) {
            return res.status(200).json({ success: true, message: "No patients found", patients: [] });
        }

        const patientList = doctor.patients.map(patient => ({
            _id: patient._id,
            name: patient.userId?.name || "Unknown", // from Userschema
            email: patient.userId?.email || "Unknown", //  from Userschema
            age: patient.age,
            gender: patient.gender,
            phoneNumber: patient.contact
        }));
        res.status(200).json({ success: true, patients: patientList });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching patients", error: error.message });
    }
};

exports.getDoctorPatientById = async (req, res) => {
    try {
        const { patientId } = req.params;

        const doctor = await Doctor.findOne({ userId: req.user.id }).populate({
            path: "patients",
            select: "age gender contact, medicalHistory, reports",
            populate: {
                path: "userId",
                select: "name email",
            }
        });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found" });
        }

        if (!doctor.patients.length) {
            return res.status(200).json({ success: false, message: "No patients found" });
        }

        const patient = doctor.patients.find((p) => p._id.toString() === patientId);

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found for this doctor" });
        }

        res.status(200).json({ success: true, patient });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving patient", error: error.message });
    }
};


exports.viewDashboard = async (req, res) => {
    try {

        const doctor = await Doctor.findOne({ userId: req.user.id })
            .populate({
                path: "userId",
                select: "name email -_id",
            });

        if (!doctor) {
            return res.status(404).json({ success: false, message: "Doctor profile not found" });
        }

        res.status(200).json({ success: true, data: doctor });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error fetching dashboard",
            error: error.message,
        });
    }
};

exports.uploadPatientImage = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.user.id;
        const doctor = await Doctor.findOne({ userId: doctorId });

        if (!doctor) {
            return res.status(403).json({ success: false, message: "Only doctors can upload images" });
        }


        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ success: false, message: "Patient not found" });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, message: "No file uploaded" });
        }

        const imagePath = `uploads/${req.file.filename}`;
        patient.images.push(imagePath);
        await patient.save();

        res.status(200).json({
            success: true,
            message: "Image uploaded successfully",
            images: patient.images
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Error uploading image", error: error.message });
    }
};


exports.analyzePatientImage = async (req, res) => {
    try {
        const { patientId, modelNumber } = req.body;

        const patient = await Patient.findById(patientId).populate("userId", "name email");
        if (!patient || !patient.images.length) {
            return res.status(400).json({ success: false, message: "Patient or image not found" });
        }

        const latestImage = patient.images[patient.images.length - 1];
        const imageFullPath = path.resolve(latestImage);

        if (!fs.existsSync(imageFullPath)) {
            return res.status(404).json({ success: false, message: "Uploaded image file not found on server" });
        }

        const formData = new FormData();
        formData.append("file", fs.createReadStream(imageFullPath));

        let modelEndpoint;
        if (modelNumber === '1') modelEndpoint = 'http://127.0.0.1:8001/api/predict_model1/';
        else if (modelNumber === '2') modelEndpoint = 'http://127.0.0.1:8001/api/predict_model2/';
        else if (modelNumber === '3') modelEndpoint = 'http://127.0.0.1:8001/api/predict_model3/';
        else return res.status(400).json({ success: false, message: "Invalid model number" });

        const response = await axios.post(modelEndpoint, formData, {
            headers: { ...formData.getHeaders() }
        });

        const { model, label, confidence } = response.data;
        const doc = new PDFDocument();
        const formattedModel = `Model${modelNumber}`;
        const currentDate = new Date();
        const formattedDate = `${currentDate.getDate().toString().padStart(2, '0')}-${(currentDate.getMonth() + 1)
            .toString()
            .padStart(2, '0')}-${currentDate.getFullYear()}`;
        const pdfFileName = `${formattedModel}_${formattedDate}.pdf`;
        const pdfPath = `uploads/reports/${pdfFileName}`;
        const pdfStream = fs.createWriteStream(pdfPath);
        doc.pipe(pdfStream);

        doc.fontSize(20).text("Prediction Report", { align: "center" });
        doc.moveDown();

        doc.fontSize(14).text(`Model: ${model}`);
        doc.text(`Predicted Label: ${label}`);
        // doc.text(`Confidence: ${(confidence * 100).toFixed(2)}%`);
        doc.moveDown();

        doc.text(`Patient Name: ${patient.userId.name}`);
        doc.text(`Email: ${patient.userId.email}`);
        doc.text(`Age: ${patient.age}`);
        doc.text(`Gender: ${patient.gender}`);
        doc.text(`Phone: ${patient.contact}`);
        doc.moveDown();

        doc.end();

        await new Promise(resolve => pdfStream.on('finish', resolve));
        patient.reports.push({ filename: path.basename(pdfPath), path: pdfPath });
        await patient.save();

        res.status(200).json({
            success: true,
            message: "Prediction successful",
            model,
            predicted_label: label,
            confidence,
            pdf_report: pdfPath
        });

    } catch (error) {
        res.status(500).json({ success: false, message: "Prediction failed", error: error.message });
    }
};