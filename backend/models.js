const mongoose = require('mongoose');

const MedicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    time: { type: String, required: true }, // e.g., '08:00 AM'
    status: { type: String, enum: ['pending', 'taken', 'missed'], default: 'pending' },
    date: { type: String, required: true } // YYYY-MM-DD
});

const GlucoseReadingSchema = new mongoose.Schema({
    value: { type: Number, required: true },
    date: { type: Date, default: Date.now }
});

module.exports = {
    Medication: mongoose.model('Medication', MedicationSchema),
    GlucoseReading: mongoose.model('GlucoseReading', GlucoseReadingSchema)
};
