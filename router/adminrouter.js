const express = require("express");
const adminrouter = express.Router();
const Admin = require("../model/Admin/admin");
const Product = require("../model/Product/Product");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const adminauth = require("../middleware/adminauth");
const multer = require("multer");

//*********************** image upload multor*********************** */
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/img");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_ " + file.originalname);
  },
});
const upload = multer({ storage: storage });
//************************** end************************************ */

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
adminrouter.post("/addedproduct", upload.single("file"), async (req, res) => {
  const pid = await req.body.id;

  try {
    if (pid == "") {
      const product = await Product({
        pid: req.body.pid,
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        img: req.file.filename,
      });
      const productAdded = await product.save();
      if (productAdded) {
        res.render("addproduct", {
          msg: productAdded.pname + " " + "added success !!!",
        });
      }
    } else {
      const result = await Product.findByIdAndUpdate(pid, {
        pid: req.body.pid,
        pname: req.body.pname,
        qty: req.body.qty,
        price: req.body.price,
        img: req.file.filename,
      });
      const pdata = await Product.find();
      res.render("productdetaile", { pdetaile: pdata });
    }
  } catch (error) {
    console.log(error);
  }
});
adminrouter.get("/productdetaile", async (req, res) => {
  try {
    const productdetaile = await Product.find();

    res.render("productdetaile", { pdetaile: productdetaile });
  } catch (error) {
    console.log(error);
  }
});
adminrouter.get("/productdelete", async (req, res) => {
  const pid = req.query.did;

  try {
    const data = await Product.findByIdAndDelete(pid);
    console.log(data);
    const productdetaile = await Product.find();
    res.render("productdetaile", { pdetaile: productdetaile });
  } catch (error) {
    console.log(error);
  }
});
adminrouter.get("/productedit", async (req, res) => {
  const pid = req.query.pid;

  try {
    const pdetaile = await Product.findById(pid);
    res.render("addproduct", { pdata: pdetaile });
  } catch (error) {
    console.log(error);
  }
});

module.exports = adminrouter;
