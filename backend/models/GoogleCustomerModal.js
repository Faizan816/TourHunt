const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// Create Schema
const customerDataSchema = new mongoose.Schema(
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
const Gcustomer = mongoose.model("Gcustomer", customerDataSchema);

module.exports = Gcustomer;
