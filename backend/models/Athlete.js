import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true }, // Wert als Zahl erzwingen
  unit: { type: String, required: false },
});

const AthleteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  measurements: [MeasurementSchema],
});

export default mongoose.model('Athlete', AthleteSchema);
