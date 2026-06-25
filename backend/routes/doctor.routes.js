const express = require("express");
const router = express.Router();
const {
  createProfile,
  getAllDoctors,
  getDoctorById,
  updateProfile,
  addSlots,
  getSlots,
  approveDoctor,
} = require("../controllers/doctor.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// ⚠️ All specific named routes MUST come before /:id routes

// Admin — get all doctors including unapproved
router.get("/all", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const Doctor = require("../models/Doctor");
    const doctors = await Doctor.find()
      .populate("user", "name email phone")
      .sort({ isApproved: 1, createdAt: -1 });
    res.json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Doctor profile routes
router.get("/my-profile", protect, authorizeRoles("doctor"), async (req, res) => {
  try {
    const Doctor = require("../models/Doctor");
    const doctor = await Doctor.findOne({ user: req.user._id });
    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Public routes
router.get("/",          getAllDoctors);
router.get("/:id/slots", getSlots);
router.get("/:id",       getDoctorById);

// Doctor only routes
router.post("/profile",  protect, authorizeRoles("doctor"), createProfile);
router.put("/profile",   protect, authorizeRoles("doctor"), updateProfile);
router.post("/slots",    protect, authorizeRoles("doctor"), addSlots);

// Admin only routes
router.put("/:id/approve", protect, authorizeRoles("admin"), approveDoctor);

module.exports = router;