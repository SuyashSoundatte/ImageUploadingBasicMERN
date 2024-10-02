const express = require('express');
const router = express.Router();
const Data = require('../models/data.model');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});

// GET route to fetch data
router.get('/', async (req, res) => {
    try {
        const data = await Data.find();
        res.status(200).json({ data });
    } catch (err) {
        res.status(500).json({
            message: "Some error occurred",
            error: err.message
        });
    }
});

// POST route to add new data
router.post('/', async (req, res) => {
    const { name, email, age, bio, FY, SY, TY } = req.body;

    try {
        // Check if the image file is present
        if (!req.files || !req.files.imageUrl) {
            return res.status(400).json({ message: "Image file is required." });
        }

        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.files.imageUrl.tempFilePath);

        const newData = new Data({
            name,
            email,
            age,
            bio,
            FY,
            SY,
            TY,
            imageUrl: result.secure_url,
        });

        const savedData = await newData.save();

        res.status(200).json({
            message: "User Added Successfully",
            show: savedData,
        });
    } catch (err) {
        res.status(500).json({
            message: "Error occurred while uploading image or saving data",
            error: err.message
        });
    }
});

module.exports = router;
