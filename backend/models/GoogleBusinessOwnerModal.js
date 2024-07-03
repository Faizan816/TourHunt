const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Create Schema
const businessDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      required: true,
    },
    userType: {
      type: String,
    },
    gender: {
      type: String,
    },
  },
  { timestamps: true }
);

// Create Model
const GBusiness = mongoose.model("GBusiness", businessDataSchema);

module.exports = GBusiness;
