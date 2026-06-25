const Appointment = require("../models/Appointment");
const Doctor = require("../models/Doctor");
const { sendNotification } = require("../socket/socket");

// POST /api/appointments — Patient books an appointment
const bookAppointment = async (req, res) => {
  try {
    const { doctorId, slotId, reason } = req.body;

    // Find the doctor
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Find the slot
    const slot = doctor.availableSlots.id(slotId);
    if (!slot) return res.status(404).json({ message: "Slot not found" });
    if (slot.isBooked) return res.status(400).json({ message: "Slot already booked" });

    // Mark slot as booked
    slot.isBooked = true;
    await doctor.save();

    // Create appointment
    const appointment = await Appointment.create({
      patient: req.user._id,
      doctor:  doctorId,
      slot: {
        date:      slot.date,
        startTime: slot.startTime,
        endTime:   slot.endTime,
      },
      reason,
      status:        "pending",
      paymentStatus: "unpaid",
    });

    // Populate doctor and patient details
    await appointment.populate("doctor");
    await appointment.populate("patient", "name email phone");

    // Send real-time notification to doctor
    sendNotification(
      appointment.doctor.user.toString(),
      "new_appointment",
      {
        message: `New appointment request from ${req.user.name}`,
        appointment,
      }
    );

    res.status(201).json({ message: "Appointment booked successfully", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/my — Get logged in user's appointments
const getMyAppointments = async (req, res) => {
  try {
    let appointments;

    if (req.user.role === "patient") {
      appointments = await Appointment.find({ patient: req.user._id })
        .populate({ path: "doctor", populate: { path: "user", select: "name email phone" } })
        .sort({ createdAt: -1 });
    } else if (req.user.role === "doctor") {
      const doctor = await Doctor.findOne({ user: req.user._id });
      if (!doctor) return res.status(404).json({ message: "Doctor profile not found" });
      appointments = await Appointment.find({ doctor: doctor._id })
        .populate("patient", "name email phone")
        .sort({ createdAt: -1 });
    }

    res.json({ count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments/:id — Get single appointment
const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate({ path: "doctor", populate: { path: "user", select: "name email phone" } })
      .populate("patient", "name email phone");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    res.json({ appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/:id/confirm — Doctor confirms appointment
const confirmAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate("patient", "name email");

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.status !== "pending") {
      return res.status(400).json({ message: "Appointment is not in pending state" });
    }

    appointment.status = "confirmed";
    await appointment.save();

    // Notify patient
    sendNotification(
      appointment.patient._id.toString(),
      "appointment_confirmed",
      {
        message: `Your appointment has been confirmed`,
        appointment,
      }
    );

    res.json({ message: "Appointment confirmed", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/:id/cancel — Patient or Doctor cancels
const cancelAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status === "completed") {
      return res.status(400).json({ message: "Cannot cancel a completed appointment" });
    }

    // Free up the slot
    const doctor = await Doctor.findById(appointment.doctor);
    const slot = doctor.availableSlots.find(
      (s) =>
        s.date === appointment.slot.date &&
        s.startTime === appointment.slot.startTime
    );
    if (slot) {
      slot.isBooked = false;
      await doctor.save();
    }

    appointment.status = "cancelled";
    await appointment.save();

    res.json({ message: "Appointment cancelled", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/appointments/:id/complete — Doctor marks as completed
const completeAppointment = async (req, res) => {
  try {
    const { notes } = req.body;
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });

    if (appointment.status !== "confirmed") {
      return res.status(400).json({ message: "Appointment must be confirmed first" });
    }

    appointment.status = "completed";
    if (notes) appointment.notes = notes;
    await appointment.save();

    res.json({ message: "Appointment completed", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/appointments — Admin gets all appointments
const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate({ path: "doctor", populate: { path: "user", select: "name email" } })
      .populate("patient", "name email")
      .sort({ createdAt: -1 });

    res.json({ count: appointments.length, appointments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  bookAppointment,
  getMyAppointments,
  getAppointmentById,
  confirmAppointment,
  cancelAppointment,
  completeAppointment,
  getAllAppointments,
};