const mongoose = require("mongoose");

//Create Schema
const tourPackageDataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    departureDate: {
      type: String,
      required: true,
    },
    arrivalDate: {
      type: String,
      required: true,
    },
    summary: {
      type: [String],
      required: true,
    },
    inclusions: {
      type: [String],
    },
    exclusions: {
      type: [String],
    },
    hotelCompanyName: {
      type: String,
      required: true,
    },
    hotelRoomExpensePerPerson: {
      type: String,
      required: true,
    },
    transportExpensePerPerson: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    destination: {
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
    departureCity: {
      type: String,
      required: true,
    },
    breakfast: {
      type: [String],
      required: true,
    },
    lunch: {
      type: [String],
      required: true,
    },
    dinner: {
      type: [String],
      required: true,
    },
    foodPrice: {
      type: String,
      required: true,
    },
    transportType: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    tourDuration: {
      type: Number,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
    },
  },
  { timestamps: true }
);

//Create Model
const TourPackage = mongoose.model("TourPackage", tourPackageDataSchema);

module.exports = TourPackage;
