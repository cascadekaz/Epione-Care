const express = require('express');
const app = express();

const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 8000;
const cookieParser = require('cookie-parser');
const path = require("path");
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
require('dotenv').config();
require('./db');

app.use("/api/auth", require("./Routes/authRoutes"));// user authentication
app.use("/api/users", require("./Routes/userRoutes"));//update profile by user (role-based)
app.use("/api/patients",require("./Routes/patientRoutes"));//view doctors, view dashboard, book appointment, view bookings
app.use("/api/doctors",require("./Routes/doctorRoutes"));//view patients, view dashboard, search patients, upload image, analyze image

app.get('/', (req, res) => {
    res.json({ message: 'The API is working' });
});

