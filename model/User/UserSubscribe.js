const mongoose = require("mongoose");
const subscribeSchema = new mongoose.Schema({
  uname: String,
  email: {
    type: String,
    require: true,
    unique: true,
  },
});

module.exports = mongoose.model("UserSubscribe", subscribeSchema);
