const express = require('express');
const cors = require('cors');
const Doctor = require('./DB.js');
const mongoose = require('mongoose');

const app = express();
app.use(cors("https://intern-a-xbqf-dk81y8b7s-shreyas-zopes-projects.vercel.app/pages"));
app.use(express.json());

mongoose.connect('mongodb+srv://shreyaszope123:l2ZiFxfgDcvvawim@cluster0.zmhu6bv.mongodb.net/Doctors')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

app.post('/api/doctors', async (req, res) => {
    const { name, specialization, location, availability, experience, fees } = req.body;
    const languages = [];
    for(let i=0;i<req.body.language.length;i++){
    languages.push(req.body.language[i]);
    }
  
    let newDoctor = new Doctor({ name, specialization, location, availability, experience, fees, languages })

    try {
      await newDoctor.save();
      res.json({ success: true, message: 'Doctors added to MongoDB.' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error adding doctors.', error: err });
    }
  });

app.get('/api/doctors', async(req, res) => {
  let { specialization, location, availability, minExperience, maxFees, language, page = 1, limit = 10 } = req.query;

  page = parseInt(page);
  limit = parseInt(limit);
  minExperience = minExperience ? parseInt(minExperience) : undefined;
  maxFees = maxFees ? parseInt(maxFees) : undefined;

  let filtered = await Doctor.find();

  if (specialization) {
    filtered = filtered.filter(doc => doc.specialization.toLowerCase() === specialization.toLowerCase());
  }
  if (location) {
    filtered = filtered.filter(doc => doc.location.toLowerCase() === location.toLowerCase());
  }
  if (availability !== undefined) {
    const availBool = availability.toLowerCase() === 'true';
    filtered = filtered.filter(doc => doc.availability === availBool);
  }
  if (minExperience !== undefined) {
    filtered = filtered.filter(doc => doc.experience >= minExperience);
  }
  if (maxFees !== undefined) {
    filtered = filtered.filter(doc => doc.fees <= maxFees);
  }
  if (language) {
    filtered = filtered.filter(doc => 
      doc.languages.some(lang => lang.toLowerCase() === language.toLowerCase())
    );
  }

  const total = filtered.length;
  const startIndex = (page - 1) * limit;
  const paginatedDoctors = filtered.slice(startIndex, startIndex + limit);

  return res.json({
    success: true,
    count: paginatedDoctors.length,
    total: total,
    page: page,
    limit: limit,
    doctors: paginatedDoctors
  });
});

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
