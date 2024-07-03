const mongoose = require("mongoose");

//Create Schema
const tourPackageBookingSchema = new mongoose.Schema(
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
    sellerContact: {
      type: String,
      required: true,
    },
    buyerContact: {
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
    foodPricePerPerson: {
      type: String,
      required: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    numberOfSeats: {
      type: Number,
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
      default: "Pending",
    },
    city: {
      type: String,
      required: true,
    },
    tourDuration: {
      type: Number,
      required: true,
    },
    businessName: {
      type: String,
      required: true,
    },
    imageUrls: {
      type: [String],
    },
    isAccommodationAvailed: {
      type: Boolean,
      required: true,
    },
    isTransportAvailed: {
      type: Boolean,
      required: true,
    },
    numberOfPeople: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const TourPackageBooking = mongoose.model(
  "TourPackageBooking",
  tourPackageBookingSchema
);

module.exports = TourPackageBooking;
