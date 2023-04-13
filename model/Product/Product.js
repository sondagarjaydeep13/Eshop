const mongoose = require("mongoose");
const validator = require("validator");
const productSchema = new mongoose.Schema({
  pid: {
    type: Number,
    require: true,
    validate(value) {
      if (!validator.isNumeric.toString(value)) {
        throw new Error("pls add pid properly,,add only number");
      }
    },
  },
  pname: {
    type: String,
    require: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error("Product name is not valide");
      }
    },
  },
  price: {
    type: Number,
    require: true,
    validate(value) {
      if (!validator.isNumeric.toString(value)) {
        throw new Error("price is not number");
      }
    },
  },
  img: {
    type: String,
  },
  qty: {
    type: Number,
    require: true,
    validate(value) {
      if (!validator.isNumeric.toString(value)) {
        throw new Error("qty is not number");
      }
    },
  },

  adddate: {
    type: Date,
    default: Date.now(),
  },
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
