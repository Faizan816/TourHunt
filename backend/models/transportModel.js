const mongoose = require("mongoose");
// Create Schema
const transportDataSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Ensure that the company name is required
    },
    businessName: {
      type: String,
      required: true,
    },
    seatPricePerPerson: {
      type: String,
      required: true,
    },
    amenities: {
      type: String,
      // required: true, // Ensure that the amenities are required
    },
    city: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true, // Ensure that the contact is required
    },
    transportType: {
      type: String,
      required: true,
    },
    capacity: {
      type: String,
      // required: true, // Ensure that the capacity is required
    },
    imageUrls: {
      type: [String],
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create Model
const Transport = mongoose.model("Transport", transportDataSchema);
module.exports = Transport;
