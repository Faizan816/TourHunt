const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Create Schema
const customerDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
    },
    userType: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Create Model
const Customer = mongoose.model("Customer", customerDataSchema);

module.exports = Customer;
