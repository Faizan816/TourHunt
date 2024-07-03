const mongoose = require("mongoose");

// Create Schema
const guideDataSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Ensure that the name is required
    },
    contact: {
      type: String,
      required: true, // Ensure that the contact is required
    },
    location: {
      type: String,
      required: true, // Ensure that the location is required
    },
    years_of_experience: {
      type: String,
      required: true, // Ensure that the years of experience are required
    },
    specialization: {
      type: String,
      required: true, // Ensure that the specialization is required
    },
    languages: {
      type: String, // Assuming the guide can speak multiple languages
      required: true, // Ensure that at least one language is required
    },
    imageUrls: {
      type: [String],
      required: true, // Ensure that the capacity is required
    },
  },
  { timestamps: true }
);

// Create Model
const Guide = mongoose.model("Guide", guideDataSchema);

module.exports = Guide;
