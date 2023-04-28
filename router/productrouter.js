const express = require("express");
const p_router = express.Router();
const Product = require("../model/Product/Product");
const Cart = require("../model/Product/Cart");
const auth = require("../middleware/auth");
const control = require("../controller/control");
const mongoose = require("mongoose");
const { mongo } = require("mongoose");
//********************** Only For Check*************************** */
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
  const userid = req.user._id;

  try {
    const viewcart = await Cart.aggregate([
      { $match: { userid: userid } },
      {
        $lookup: {
          from: "products",
          localField: "pid",
          foreignField: "_id",
          as: "Product",
        },
      },
    ]);

    const productdata = [];

    for (var i = 0; i < viewcart.length; i++) {
      productdata.push(...viewcart[i].Product);
    }

    res.render("cart", { usercart: productdata });
  } catch (error) {
    console.log(error);
  }
});
//************************* Delete cart product****************************** */
p_router.get("/deletecart", auth, async (req, res) => {
  const pid = req.query.did;
  const uid = req.user._id;

  try {
    const data = await Cart.deleteOne({ pid: pid, userid: uid });
    // console.log(data);
    const usercarts = await control.cart(uid); // cart() call here
    res.render("cart", { usercart: usercarts });
  } catch (error) {
    console.log(error);
  }
});
p_router.get("/editcart", auth, async (req, res) => {
  const uid = req.user._id;
  const pid = req.query.eid;
  // console.log(pid);
  // console.log(userid);
  try {
    const usercarts = await control.cart(uid);
    usercarts.map((e) => {
      console.log(e == pid);
    });
  } catch (error) {}
});
module.exports = p_router;
