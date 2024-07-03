const mongoose = require("mongoose");

//Create Schema
const favoritesSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
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
    serviceType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const Favorite = mongoose.model("Favorite", favoritesSchema);

module.exports = Favorite;
