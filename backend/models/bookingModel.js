const mongoose = require("mongoose");

//Create Schema
const bookingSchema = new mongoose.Schema(
  {
    buyerId: {
      type: String,
      required: true,
    },
    sellerId: {
      type: String,
      required: true,
    },
    serviceId: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    buyerName: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    buyerEmail: {
      type: String,
      required: true,
    },
    sellerEmail: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
