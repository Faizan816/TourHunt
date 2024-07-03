const mongoose = require("mongoose");

// Define the schema for the business
const businessSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    businessName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
    },
    cnic: {
      type: String,
      required: true,
    },
    ntn: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model from the schema
const Business = mongoose.model("Business", businessSchema);

module.exports = Business;
