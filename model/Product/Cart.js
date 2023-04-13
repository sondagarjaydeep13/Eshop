const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  pid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  userid: {
    type: mongoose.Schema.Types.ObjectId,
  },
  addDate: {
    type: Date,
    default: Date.now(),
  },
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
