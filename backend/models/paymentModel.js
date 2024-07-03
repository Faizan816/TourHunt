const mongoose = require("mongoose");

//Create Schema
const paymentSchema = new mongoose.Schema(
  {
    serviceId: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
    },
    serviceName: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

//Create Model
const Payment = mongoose.model("Payment", paymentSchema);

module.exports = Payment;
