const Product = require("../model/Product/Product");
const Cart = require("../model/Product/Cart");
const productroter = require("../router/productrouter");
const cart = async (uid) => {
  try {
    const usercart = [];
    const viewcart = await Cart.aggregate([
      { $match: { userid: uid } },
      {
        $lookup: {
          from: "products",
          localField: "pid",
          foreignField: "_id",
          as: "Products",
        },
      },
    ]);
    for (var i = 0; i < viewcart.length; i++) {
      usercart.push(...viewcart[i].Products);
    }
    return usercart;
  } catch (error) {
    console.log(error);
  }
};
module.exports = { cart };
