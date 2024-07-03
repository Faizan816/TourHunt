const { default: mongoose } = require("mongoose");
const monogoose = require("mongoose");

const CurrentUserSchema = new mongoose.Schema({
  email: {
    type: String,
  },
  username: {
    type: String,
  },
  userType: {
    type: String,
  },
});

const CurrentUser = mongoose.model("CurrentUser", CurrentUserSchema);

module.exports = CurrentUser;
