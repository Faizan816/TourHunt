const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    hotelname: {
      type: String,
      required: true,
    },
    roomType: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    ameniti: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    services: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String], // Define as an array of strings
      required: true,
    },
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

module.exports = Hotel;
