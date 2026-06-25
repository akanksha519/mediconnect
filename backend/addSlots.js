const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  require('./models/User');
  const Doctor = require('./models/Doctor');

  const slots = [
    { date: '2026-07-10', startTime: '09:00', endTime: '09:30', isBooked: false },
    { date: '2026-07-10', startTime: '09:30', endTime: '10:00', isBooked: false },
    { date: '2026-07-10', startTime: '10:00', endTime: '10:30', isBooked: false },
    { date: '2026-07-11', startTime: '11:00', endTime: '11:30', isBooked: false },
    { date: '2026-07-11', startTime: '11:30', endTime: '12:00', isBooked: false },
  ];

  await Doctor.updateMany({}, { $push: { availableSlots: { $each: slots } } });
  console.log('Slots added to all doctors!');
  mongoose.disconnect();
});