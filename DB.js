const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialization: { type: String, required: true },
  location: { type: String, required: true },
  availability: { type: Boolean, required: true },
  experience: { type: Number, required: true },
  fees: { type: Number, required: true },
  languages: { type: [String], required: true },
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
