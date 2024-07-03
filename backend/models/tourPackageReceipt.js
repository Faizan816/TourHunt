const mongoose = require("mongoose");

//Create Schema
const tourPackageReceiptSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    departureCity: {
      type: String,
      required: true,
    },
    destinationCity: {
      type: String,
      required: true,
    },
    bookingDate: {
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
    tourDuration: {
      type: Number,
      required: true,
    },
    hotelRoomExpensePerPerson: {
      type: Number,
    },
    numberOfRooms: {
      type: Number,
    },
    transportExpensePerPerson: {
      type: Number,
    },
    numberOfSeats: {
      type: Number,
    },
    foodPrice: {
      type: Number,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const TourPackageReceipt = mongoose.model(
  "TourPackageReceipt",
  tourPackageReceiptSchema
);

module.exports = TourPackageReceipt;
