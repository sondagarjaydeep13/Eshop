const mongoose = require("mongoose");

const UserUpdateSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
  },
  Update_on: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("UserStayUpdate", UserUpdateSchema);
