const mongoose = require("mongoose");

//Create Schema
const restaurantDataSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true, // Ensure that the name is required
    },
    businessName: {
      type: String,
      required: true,
    },
    cuisine: {
      type: String,
      required: true, // Ensure that the location is required
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
    averageFoodRate: {
      type: Number,
      required: true,
    },
    openingTime: {
      type: String,
      required: true,
    },
    closingTime: {
      type: String,
      required: true,
    },
    reservation: {
      type: String,
      required: true, // Ensure that the reservation is required
    },
    reservationCharges: {
      type: Number,
      required: true,
    },
    imageUrls: {
      type: [String], // Define as an array of strings
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

//Create Model
const Restaurant = mongoose.model("Restaurant", restaurantDataSchema);

module.exports = Restaurant;
