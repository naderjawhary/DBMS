import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import athletesRouter from './routes/athletes.js';
import treesRouter from './routes/trees.js';
import measurementsRouter from './routes/measurements.js';

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/trees', treesRouter);
app.use('/api/athletes', athletesRouter);
app.use('/api/measurements', measurementsRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
