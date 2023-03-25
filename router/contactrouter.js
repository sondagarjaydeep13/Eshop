const express = require("express");
const contact_router = express.Router();
const Contact = require("../model/Contact/Contact");
contact_router.post("/userqueries", async (req, resp) => {
  try {
    const usercontact = await Contact({
      name: req.body.name,
      email: req.body.email,
      subject: req.body.subject,
      message: req.body.message,
    });
    await usercontact.save();
    resp.render("contact", {
      contactmsg: "Thanks,,We will contact you as soon as possible",
    });
  } catch (error) {
    resp.render("contact", { contactmsgwarg: "Somthing else wrong..!!" });
  }
});
module.exports = contact_router;
