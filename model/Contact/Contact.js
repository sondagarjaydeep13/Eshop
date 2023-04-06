const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
  img: {
    type: String,
  },
});
module.exports = mongoose.model("ContactUser", contactSchema);
