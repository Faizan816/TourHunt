const mongoose = require("mongoose");

//Create Schema
const restaurantBookingSchema = new mongoose.Schema(
  {
    sellerId: {
      type: String,
      required: true,
    },
    sellerName: {
      type: String,
      required: true,
    },
    buyerId: {
      type: String,
      required: true,
    },
    buyerName: {
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
    cuisine: {
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
    contact: {
      type: String,
      required: true,
    },
    customerContact: {
      type: String,
      required: true,
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
    reservationDate: {
      type: String,
      required: true,
    },
    reservationTime: {
      type: String,
      required: true,
    },
    reservationCharges: {
      type: Number,
      required: true,
    },
    bookingDate: {
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
const RestaurantBooking = mongoose.model(
  "RestaurantBooking",
  restaurantBookingSchema
);

module.exports = RestaurantBooking;
