const mongoose = require("mongoose");

//Create Schema
const complaintSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    complaint: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const Complaint = mongoose.model("Complaint", complaintSchema);

module.exports = Complaint;
