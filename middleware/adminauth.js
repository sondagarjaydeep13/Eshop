const jwt = require("jsonwebtoken");
const Admin = require("../model/Admin/admin");

const adminauth = async (req, res, next) => {
  const Token = req.cookies.admin;

  try {
    const verifyToken = await jwt.verify(Token, process.env.ADMIN);
    const admindata = await Admin.findOne({ _id: verifyToken._id });
    if (verifyToken) {
      req.admin = admindata;
      req.token = Token;
      next();
    } else {
      res.render("adminlogin", { loginmsg: "Invalide toke pls login first" });
    }
  } catch (error) {
    res.render("adminlogin", { loginmsg: "Invalide toke pls login first" });
  }
};
module.exports = adminauth;
