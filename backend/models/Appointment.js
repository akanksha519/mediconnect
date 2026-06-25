const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor:  { type: mongoose.Schema.Types.ObjectId, ref: "Doctor", required: true },
    slot: {
      date:      String,
      startTime: String,
      endTime:   String,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    reason:        { type: String },
    notes:         { type: String },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    paymentId: { type: String },
    documents: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Appointment", appointmentSchema);