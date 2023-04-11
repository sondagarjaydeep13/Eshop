const express = require("express");
const p_router = express.Router();
const Product = require("../model/Product/Product");
const Cart = require("../model/Product/Cart");
p_router.post("/addproduct", async (req, res) => {
  try {
    const product = new Product({
      pid: req.body.pid,
      pname: req.body.pname,
      price: req.body.price,
    });
    const productdata = await product.save();
    res.send(productdata);
  } catch (error) {
    res.send(error);
  }
});
p_router.get("/addtocart", (req, res) => {
  const pid = req.body.id;
  console.log(pid);
});
module.exports = p_router;
