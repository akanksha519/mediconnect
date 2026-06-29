const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const User = require('./models/User');
  const Doctor = require('./models/Doctor');

  const slots = [
    { date: '2026-07-10', startTime: '09:00', endTime: '09:30', isBooked: false },
    { date: '2026-07-10', startTime: '09:30', endTime: '10:00', isBooked: false },
    { date: '2026-07-10', startTime: '10:00', endTime: '10:30', isBooked: false },
    { date: '2026-07-11', startTime: '11:00', endTime: '11:30', isBooked: false },
    { date: '2026-07-11', startTime: '11:30', endTime: '12:00', isBooked: false },
  ];

  const doctors = [
    { name: 'Dr. Rajesh Kumar',  email: 'rajesh@test.com',  specialization: 'Cardiologist',  experience: 8,  fee: 500, hospital: 'Apollo Hospital',   city: 'Hyderabad', qualifications: ['MBBS', 'MD'] },
    { name: 'Dr. Priya Sharma',  email: 'priya@test.com',   specialization: 'Dermatologist', experience: 5,  fee: 400, hospital: 'Yashoda Hospital',  city: 'Hyderabad', qualifications: ['MBBS', 'MD Dermatology'] },
    { name: 'Dr. Arjun Mehta',   email: 'arjun@test.com',   specialization: 'Neurologist',   experience: 12, fee: 800, hospital: 'KIMS Hospital',     city: 'Hyderabad', qualifications: ['MBBS', 'MD', 'DM Neurology'] },
    { name: 'Dr. Sneha Reddy',   email: 'sneha@test.com',   specialization: 'Pediatrician',  experience: 7,  fee: 350, hospital: 'Rainbow Hospital',  city: 'Hyderabad', qualifications: ['MBBS', 'MD Pediatrics'] },
    { name: 'Dr. Vikram Nair',   email: 'vikram@test.com',  specialization: 'Orthopedic',    experience: 10, fee: 600, hospital: 'Care Hospital',     city: 'Hyderabad', qualifications: ['MBBS', 'MS Orthopedics'] },
    { name: 'Dr. Kavya Singh',   email: 'kavya@test.com',   specialization: 'Gynecologist',  experience: 6,  fee: 450, hospital: 'Fernandez Hospital', city: 'Hyderabad', qualifications: ['MBBS', 'MD Gynecology'] },
  ];

  for (const d of doctors) {
    try {
      const user = await User.create({ name: d.name, email: d.email, password: '123456', role: 'doctor', phone: '9876543210' });
      await Doctor.create({ user: user._id, specialization: d.specialization, experience: d.experience, consultationFee: d.fee, hospital: d.hospital, city: d.city, qualifications: d.qualifications, isApproved: true, availableSlots: slots });
      console.log('Created:', d.name);
    } catch (err) {
      console.log('Skipped:', d.name, '-', err.message);
    }
  }

  console.log('Done!');
  mongoose.disconnect();
});