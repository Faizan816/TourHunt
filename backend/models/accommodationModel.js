const mongoose = require("mongoose");

//Create Schema
const accommodationDataScehma = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
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
    amenities: {
      type: String,
      // required: true,
    },
    hotelRoomExpensePerPerson: {
      type: String,
      required: true,
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

//Create Model
const Accommodation = mongoose.model("Accommodation", accommodationDataScehma);

module.exports = Accommodation;
