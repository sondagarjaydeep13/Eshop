const express = require("express");
const user_router = express.Router();
const User = require("../model/User/User");
const UserSubscribe = require("../model/User/UserSubscribe");
const UserStayUpdate = require("../model/User/UserStayUpdate");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
user_router.get("/", (req, resp) => {
  const token = req.cookies.jwt;
  if (token == undefined) {
    resp.render("index", { login: "Login" });
  } else {
    resp.render("index", { logout: "Logout", logoutall: "Logout all" });
  }
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
  resp.render("login", { logout: "Logout" });
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

    // const isToken = await jwt.sign({ _id: userdata._id }, process.env.SKEY);
    if (isCompare) {
      const token = await userdata.generateToken();

      const user = await User.findOne({ email: email });
      // console.log(user.Tokens.length);
      if (user.Tokens.length > 3) {
        resp.render("login", { loginmsg: "maximum login limit exist !!!" });
      } else {
        resp.cookie("jwt", token);

        resp.render("index", {
          logout: "Logout",
          logoutall: "Logout-All",
          udata: userdata.uname,
        });
      }
    } else {
      resp.render("login", { loginmsg: "Invalide Username or Password..!!!" });
    }
  } catch (error) {
    // resp.render("login", { loginmsg: "Invalide Username or Password..!!!" });
    console.log(error);
  }
});
//***************************** Logout****************************************** */
user_router.get("/logout", auth, async (req, resp) => {
  try {
    const user = req.user;
    const token = req.token;
    user.Tokens = user.Tokens.filter((e) => {
      return e.token != token;
    });
    await user.save();
    resp.clearCookie("jwt");
    resp.render("index", { login: "Login" });
  } catch (error) {
    console.log(error);
  }
});
user_router.get("/logoutall", auth, async (req, res) => {
  const userdata = req.user;

  try {
    userdata.Tokens = [];
    await userdata.save();
    res.clearCookie("jwt");
    res.render("index", { login: "Login" });
  } catch (error) {
    console.log(error);
  }
});

module.exports = user_router;
