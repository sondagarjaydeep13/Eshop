const express = require("express");
const user_router = express.Router();
const User = require("../model/User/User");
const UserSubscribe = require("../model/User/UserSubscribe");
const UserStayUpdate = require("../model/User/UserStayUpdate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
user_router.get("/", (req, resp) => {
  resp.render("index", { login: "Login", register: "Register" });
});

//*********************** Shop Page***************************** */
user_router.get("/shop", (req, resp) => {
  resp.render("shop");
});
//**************************shopdetail*************************** */
user_router.get("/shopdetail", (req, resp) => {
  resp.render("detail");
});
//****************************Cart******************************** */
user_router.get("/cart", auth, (req, resp) => {
  resp.render("cart");
});
//************************** Check out****************************** */
user_router.get("/checkout", auth, (req, resp) => {
  resp.render("checkout");
});
//************************** Contact******************************* */
user_router.get("/contact", (req, resp) => {
  resp.render("contact");
});
//***************************User Registration page********************** */
user_router.get("/registration", (req, resp) => {
  resp.render("registration");
});
//******************************User login page ************************/
user_router.get("/login", (req, resp) => {
  resp.render("login");
});
//****************************** Subscribe************************* */
user_router.post("/subscribe", async (req, resp) => {
  try {
    const user = await UserSubscribe({
      uname: req.body.uname,
      email: req.body.subemail,
    });
    await user.save();
    resp.render("index", { submsg: "Thanks for subscribe..!!!" });
  } catch (error) {
    resp.render("index", { submsgwarn: "Email already exists....!!" });
  }
});
//***********************************Add User****************** ****/
user_router.post("/adduser", async (req, resp) => {
  try {
    const user = await User({
      uname: req.body.uname,
      pass: req.body.pass,
      email: req.body.email,
      pnumber: req.body.pnumber,
    });
    await user.save();
    resp.render("registration", { rgmsg: "User Registration success..!!!" });
  } catch (error) {
    resp.render(error);
  }
});
//******************************Stay Updates******************************** */
user_router.post("/stayupdate", async (req, resp) => {
  try {
    const useremail = await UserStayUpdate({
      email: req.body.email,
    });
    await useremail.save();
    resp.render("index", { staymsg: "Thanks for Subscribe..!!!" });
  } catch (error) {
    resp.render("index", { staymsgwarn: "Email already exists..!!!!" });
  }
});
//******************************* User login******************************** */
user_router.post("/userlogin", async (req, resp) => {
  try {
    const email = req.body.email;
    const pass = req.body.pass;
    const userdata = await User.findOne({ email: email });
    const isCompare = await bcrypt.compare(pass, userdata.pass);
    const isToken = await jwt.sign({ _id: userdata._id }, process.env.SKEY);
    if (isCompare) {
      resp.cookie("jwt", isToken);
      resp.render("index", { logout: "Logout", logoutall: "Logout-All" });
    } else {
      resp.render("login", { loginmsg: "Invalide Username or Password..!!!" });
    }
  } catch (error) {
    resp.render("login", { loginmsg: "Invalide Username or Password..!!!" });
  }
});
//***************************** Logout****************************************** */
user_router.get("/logout", (req, resp) => {
  resp.clearCookie("jwt");
  resp.render("index", { login: "Login", register: "Register" });
});

module.exports = user_router;
