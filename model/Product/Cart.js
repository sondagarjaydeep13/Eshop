const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  pid: {
    type: Number,
  },
  userid: {
    type: String,
  },
  addcart: {
    type: Date,
    default: Date.now(),
  },
});
const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
