const express = require("express");
const adminrouter = express.Router();
const Admin = require("../model/Admin/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

adminrouter.get("/adminpage", (req, res) => {
  res.render("adminlogin");
});
adminrouter.post("/addadmin", async (req, res) => {
  const admin = await Admin(req.body);

  try {
    const admindata = await admin.save();
    res.send(admindata);
  } catch (error) {
    res.send(error);
  }
});
adminrouter.post("/adminlogin", async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;

  try {
    const adminresult = await Admin.findOne({ email: email });
    const isvalide = await bcrypt.compare(pass, adminresult.pass);
    // const adminToken = await jwt.sign(
    //   { _id: adminresult._id },
    //   process.env.ADMIN
    // );
    const adminToken = await adminresult.genratetoken();

    if (isvalide) {
      res.cookie("admin", adminToken);
      res.render("dashboard", { adminname: adminresult.adminname });
    } else {
      res.render("adminlogin", { loginmsg: "Admin user or password invalide" });
    }
  } catch {
    res.render("adminlogin", { loginmsg: "Admin user or password invalide" });
  }
});
adminrouter.get("/adminlogout", (req, res) => {
  res.clearCookie("admin");
  res.render("adminlogin");
});
module.exports = adminrouter;
