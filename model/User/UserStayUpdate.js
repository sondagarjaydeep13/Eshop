const mongoose = require("mongoose");
const validator = require("validator");
const UserUpdateSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Invalide email  !!!");
      }
    },
  },
  Update_on: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("UserStayUpdate", UserUpdateSchema);
