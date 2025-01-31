import mongoose from 'mongoose';

const MeasurementSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  value: { type: Number, required: true }, // Wert als Zahl erzwingen
  unit: { type: String, required: false },
});

const AthleteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: Number, enum: [0, 1], required: true }, // 0 = Male, 1 = Female
  measurements: [MeasurementSchema],
});

export default mongoose.model('Athlete', AthleteSchema);
