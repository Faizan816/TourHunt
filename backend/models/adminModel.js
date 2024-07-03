const mongoose = require("mongoose");

//Create Schema
const adminDataSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
  },
  { timestamps: true }
);

//Create Model
const Admin = mongoose.model("Admin", adminDataSchema);

module.exports = Admin;
