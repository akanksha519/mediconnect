const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { initSocket } = require("./socket/socket");

dotenv.config();

const app = express();
const server = http.createServer(app);

connectDB();
initSocket(server);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://mediconnect-chi-five.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.use("/api/auth",         require("./routes/auth.routes"));
app.use("/api/doctors",      require("./routes/doctor.routes"));
app.use("/api/appointments", require("./routes/appointment.routes"));
app.use("/api/payments", require("./routes/payment.routes"));

app.get("/", (req, res) => res.json({ message: "MediConnect API running ✅" }));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));