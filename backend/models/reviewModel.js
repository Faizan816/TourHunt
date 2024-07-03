const mongoose = require("mongoose");

//Create Schema
const reviewSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      reqquired: true,
    },
    email: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

//Create Model
const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
