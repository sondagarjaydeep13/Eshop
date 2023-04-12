const express = require("express");
const adminrouter = express.Router();
const Admin = require("../model/Admin/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminauth = require("../middleware/adminauth");

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
adminrouter.get("/adminlogout", adminauth, async (req, res) => {
  try {
    const admindata = req.admin;
    const token = req.token;

    admindata.Tokens = await admindata.Tokens.filter((e) => {
      return e.token != token;
    });

    await admindata.save();
    res.clearCookie("admin");
    res.render("adminlogin");
  } catch (error) {
    res.status(404).send("404:some: error");
  }
});
adminrouter.get("/adminlogoutall", adminauth, async (req, res) => {
  const admindata = req.admin;

  try {
    admindata.Tokens = [];
    await admindata.save();
    res.render("adminlogin");
  } catch (error) {
    res.status(404).send("404:some : error ");
  }
});
adminrouter.get("/addproduct", (req, res) => {
  res.render("addproduct");
});
module.exports = adminrouter;
