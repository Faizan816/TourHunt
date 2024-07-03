const mongoose = require("mongoose");

//Create Schema
const accommodationBookingSchema = new mongoose.Schema(
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
    amountPaid: {
      type: Number,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    contact: {
      type: Number,
      required: true,
    },
    customerContact: {
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
      required: true,
    },
    hotelRoomExpensePerPerson: {
      type: Number,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    bookingDate: {
      type: String,
      required: true,
    },
    reservationDate: {
      type: String,
      required: true,
    },
    reservationTime: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
  },
  { timestamps: true }
);

//Create Model
const AccommodationBooking = mongoose.model(
  "AccommodationBooking",
  accommodationBookingSchema
);

module.exports = AccommodationBooking;
