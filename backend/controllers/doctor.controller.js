const Doctor = require("../models/Doctor");
const User = require("../models/User");

// POST /api/doctors/profile — Doctor creates their profile
const createProfile = async (req, res) => {
  try {
    const { specialization, experience, qualifications, consultationFee, about, hospital, city } = req.body;

    // Check if doctor profile already exists
    const existing = await Doctor.findOne({ user: req.user._id });
    if (existing) return res.status(400).json({ message: "Profile already exists" });

    const doctor = await Doctor.create({
      user:            req.user._id,
      specialization,
      experience,
      qualifications,
      consultationFee,
      about,
      hospital,
      city,
    });

    res.status(201).json({ message: "Profile created successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/doctors — Get all approved doctors (patients can see this)
const getAllDoctors = async (req, res) => {
  try {
    const { specialization, city, search } = req.query;

    // Build filter object dynamically
    const filter = { isApproved: true };
    if (specialization) filter.specialization = specialization;
    if (city)           filter.city = new RegExp(city, "i"); // case insensitive

    let doctors = await Doctor.find(filter)
      .populate("user", "name email phone profileImage") // get user details
      .sort({ rating: -1 }); // highest rated first

    // Search by doctor name
    if (search) {
      doctors = doctors.filter((d) =>
        d.user.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    res.json({ count: doctors.length, doctors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/doctors/:id — Get single doctor details
const getDoctorById = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id)
      .populate("user", "name email phone profileImage");

    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    res.json({ doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/doctors/profile — Doctor updates their profile
const updateProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Profile not found" });

    const updates = req.body;
    Object.assign(doctor, updates); // merge updates into doctor object
    await doctor.save();

    res.json({ message: "Profile updated", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/doctors/slots — Doctor adds available time slots
const addSlots = async (req, res) => {
  try {
    const { slots } = req.body;
    // slots = [{ date: "2024-12-25", startTime: "10:00", endTime: "10:30" }]

    const doctor = await Doctor.findOne({ user: req.user._id });
    if (!doctor) return res.status(404).json({ message: "Profile not found" });

    doctor.availableSlots.push(...slots); // add new slots to existing ones
    await doctor.save();

    res.json({ message: "Slots added successfully", slots: doctor.availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET /api/doctors/:id/slots — Get available slots for a doctor
const getSlots = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // Only return slots that are not booked
    const availableSlots = doctor.availableSlots.filter((s) => !s.isBooked);

    res.json({ slots: availableSlots });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// PUT /api/doctors/:id/approve — Admin approves a doctor
const approveDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    doctor.isApproved = true;
    await doctor.save();

    res.json({ message: "Doctor approved successfully", doctor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createProfile, getAllDoctors, getDoctorById, updateProfile, addSlots, getSlots, approveDoctor };