const jwt = require("jsonwebtoken");
const User = require("../model/User/User");
const auth = async (req, resp, next) => {
  const token = req.cookies.jwt;

  try {
    const isToken = await jwt.verify(token, process.env.SKEY);
    const userdata = await User.findOne({ _id: isToken._id });
    if (isToken) {
      req.user = userdata;
      req.token = token;
      next();
    } else {
      resp.render("login", { login: "Invalide Token pls login....!!!" });
    }
  } catch (error) {
    resp.render("login", { login: "Invalide Token pls login....!!!" });
  }
};
module.exports = auth;
