const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
  name: String,
  email: String,
  subject: String,
  message: String,
});
module.exports = mongoose.model("ContactUser", contactSchema);
