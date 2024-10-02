const express = require('express');
const cors = require('cors'); // Move cors import here
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');
const dataRoute = require('./routes/data.route');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors()); // Move this to the app.js to apply globally
app.use(bodyParser.json());
app.use(express.json());
app.use(fileUpload({ 
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Database connection using async/await
(async () => {
    try {
        if (!process.env.MONGO_URL) {
            throw new Error('MONGO_URL is not defined in .env');
        }
        await mongoose.connect(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
    }
})();

// Routes
app.use('/data', dataRoute);

// Global error handler (optional)
app.use((err, req, res, next) => {
    console.error(err); // Log error for debugging
    res.status(500).json({
        message: err.message || 'Internal Server Error',
        error: err.stack,
    });
});

module.exports = app;
