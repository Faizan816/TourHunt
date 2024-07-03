const mongoose = require("mongoose");

// Define the schema for the business
const requestsHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
    },
    requestName: {
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
    requestStatus: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model from the schema
const RequestsHistory = mongoose.model(
  "RequestsHistory",
  requestsHistorySchema
);

module.exports = RequestsHistory;
