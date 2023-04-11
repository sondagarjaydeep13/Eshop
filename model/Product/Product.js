const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  pid: {
    type: Number,
  },
  pname: {
    type: String,
  },
  price: {
    type: Number,
  },
  adddate: {
    type: Date,
    default: Date.now(),
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
