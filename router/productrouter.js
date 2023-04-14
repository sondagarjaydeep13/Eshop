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
  try {
    const userId = req.user._id; // Retrieve user ID from req.user object
    const cartData = await Cart.findOne({ user: userId }).populate(
      "items.product"
    ); // Find the cart data for the user
    console.log(cartData);
    if (!cartData) {
      return res.status(404).json({ error: "Cart not found" });
    }
    const products = cartData.items.map((item) => item.product); // Extract the product data from the cart items
    return res.json(products);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = p_router;
