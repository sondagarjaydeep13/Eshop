const express = require("express");
const p_router = express.Router();
const Product = require("../model/Product/Product");
const Cart = require("../model/Product/Cart");
const auth = require("../middleware/auth");
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
//****************************** Product add to cart********************* */
p_router.get("/addtocart", auth, async (req, res) => {
  const userid = req.user._id;
  const pid = req.query.pid;
  try {
    const addproduct = await Cart({
      userid: userid,
      pid: pid,
    }).save();
    res.status(200).send("Product added to cart successfully.");
  } catch (error) {
    res.status(500).send("An error occurred while adding the product to cart.");
  }
});
p_router.get("/cart", auth, async (req, res) => {
  const user = req.user;
  try {
  } catch (error) {
    console.log(error);
  }
});

module.exports = p_router;
