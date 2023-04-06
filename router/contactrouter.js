const express = require("express");
const contact_router = express.Router();
const Contact = require("../model/Contact/Contact");
const multer = require("multer");

//**********************Multer******************* */
var storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, "./public/img");
  },
  filename: function (req, file, callback) {
    callback(null, Date.now() + "_" + file.originalname);
  },
});

var upload = multer({ storage: storage });
//*********************end************************ */
contact_router.post(
  "/userqueries",
  upload.single("file"),
  async (req, resp) => {
    try {
      const usercontact = await Contact({
        name: req.body.name,
        email: req.body.email,
        subject: req.body.subject,
        message: req.body.message,
        img: req.file.filename,
      });
      await usercontact.save();
      resp.render("contact", {
        contactmsg: "Thanks,,We will contact you as soon as possible",
      });
    } catch (error) {
      resp.render("contact", { contactmsgwarg: "Somthing else wrong..!!" });
    }
  }
);
module.exports = contact_router;
