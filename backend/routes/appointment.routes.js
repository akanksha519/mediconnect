const express = require("express");
const router = express.Router();
const {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  getAllAppointments,
} = require("../controllers/appointment.controller");
const { protect } = require("../middleware/auth.middleware");
const { authorizeRoles } = require("../middleware/role.middleware");

// Patient routes
router.post("/",     protect, authorizeRoles("patient"), bookAppointment);

// All logged in users
router.get("/my",    protect, getMyAppointments);
router.get("/:id",   protect, getAppointmentById);

// Doctor routes
router.put("/:id/confirm",  protect, authorizeRoles("doctor"),  confirmAppointment);
router.put("/:id/complete", protect, authorizeRoles("doctor"),  completeAppointment);

// Patient or Doctor
router.put("/:id/cancel",   protect, cancelAppointment);

// Admin routes
router.get("/",      protect, authorizeRoles("admin"), getAllAppointments);

module.exports = router;