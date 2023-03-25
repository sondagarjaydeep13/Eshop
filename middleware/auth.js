const jwt = require("jsonwebtoken");
const User = require("../model/User/User");
const auth = async (req, resp, next) => {
  const Token = req.cookies.jwt;

  try {
    const isToken = await jwt.verify(Token, process.env.SKEY);
    const userdata = await User.findOne({ _id: isToken._id });
    if (isToken) {
      req.user = userdata;
      next();
    } else {
      resp.render("login", { login: "Pls login first....!!!" });
    }
  } catch (error) {
    resp.render("login", { login: "Pls login first....!!!" });
  }
};
module.exports = auth;
