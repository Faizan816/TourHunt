const mongoose = require("mongoose");

// Define the schema for the business
const businessInviteSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    businessName: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    province: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    contact: {
      type: String,
      required: true,
    },
    services: {
      type: [String],
      required: true,
    },
  },
  { timestamps: true }
);

// Create a model from the schema
const BusinessInvite = mongoose.model("BusinessInvite", businessInviteSchema);

module.exports = BusinessInvite;
