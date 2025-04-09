const express = require("express");
const { updateProfile } = require("../Controller/userController");
const authMiddleware = require("../Middleware/authMiddleware");

const router = express.Router();

router.put("/update-profile", authMiddleware, updateProfile);

module.exports = router;
