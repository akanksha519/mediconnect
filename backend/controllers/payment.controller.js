const crypto      = require("crypto");
const Appointment = require("../models/Appointment");

// POST /api/payments/create-order
// Simulates a Razorpay order for development
const createOrder = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId)
      .populate({ path: "doctor", select: "consultationFee" });

    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({ message: "Already paid" });
    }

    const amount = appointment.doctor.consultationFee * 100;

    // Simulated order — replace with real Razorpay when you have keys
    const simulatedOrder = {
      id:       `order_${crypto.randomBytes(8).toString("hex")}`,
      amount,
      currency: "INR",
    };

    res.json({
      orderId:       simulatedOrder.id,
      amount:        simulatedOrder.amount,
      currency:      simulatedOrder.currency,
      appointmentId: appointmentId,
      keyId:         process.env.RAZORPAY_KEY_ID || "rzp_test_demo",
      simulated:     true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/payments/verify
const verifyPayment = async (req, res) => {
  try {
    const { appointmentId, simulated } = req.body;

    // If simulated payment, just mark as paid directly
    if (simulated) {
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          paymentStatus: "paid",
          paymentId:     `pay_${crypto.randomBytes(8).toString("hex")}`,
          status:        "confirmed",
        },
        { new: true }
      );
      return res.json({ message: "Payment successful", appointment });
    }

    // Real Razorpay verification (use when you have real keys)
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const body     = razorpay_order_id + "|" + razorpay_payment_id;
    const expected = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expected !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      {
        paymentStatus: "paid",
        paymentId:     razorpay_payment_id,
        status:        "confirmed",
      },
      { new: true }
    );

    res.json({ message: "Payment successful", appointment });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createOrder, verifyPayment };