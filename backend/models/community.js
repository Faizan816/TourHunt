const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  messages: [messageSchema],
});

const communitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  users: [userSchema],
});

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
