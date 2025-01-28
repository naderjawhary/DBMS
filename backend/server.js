const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const athletesRouter = require('./routes/athletes');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

app.use('/api/trees', require('./routes/trees'));
app.use('/api/athletes', athletesRouter);
app.use('/api/measurements', require('./routes/measurements'));


// Basic route for testing
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});