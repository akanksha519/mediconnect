const mongoose = require("mongoose");

const slotSchema = new mongoose.Schema({
  date:      { type: String, required: true }, // "2024-12-25"
  startTime: { type: String, required: true }, // "10:00"
  endTime:   { type: String, required: true }, // "10:30"
  isBooked:  { type: Boolean, default: false },
});

const doctorSchema = new mongoose.Schema(
  {
    user:            { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    specialization:  { type: String, required: true },
    experience:      { type: Number, required: true },
    qualifications:  [{ type: String }],
    consultationFee: { type: Number, required: true },
    about:           { type: String },
    hospital:        { type: String },
    city:            { type: String },
    availableSlots:  [slotSchema],
    rating:          { type: Number, default: 0 },
    totalReviews:    { type: Number, default: 0 },
    isApproved:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);