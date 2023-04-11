const express = require("express");
require("dotenv").config();
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const hbs = require("hbs");
const bodyParser = require("body-parser");
const userrouter = require("../router/userrouter");
const contactrouter = require("../router/contactrouter");
const productrouter = require("../router/productrouter");
const adminrouter = require("../router/adminrouter");
const cookieParser = require("cookie-parser");
const port = process.env.port || 3000;
const dburl = process.env.dburl;

const viewpath = path.join(__dirname, "../templetes/view");
const partialpath = path.join(__dirname, "../templetes/partial");
const publicpath = path.join(__dirname, "../public");

app.set("view engine", "hbs");
app.set("views", viewpath);
hbs.registerPartials(partialpath);
app.use(express.static(publicpath));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.json());
//**************************** Server port ************************************** */
app.listen(port, () => {
  console.log("Server running on port" + " " + port);
});

//*****************************Mongoose****************************************** */
mongoose
  .connect(dburl)
  .then((result) => {
    console.log("E-shop_project database connected");
  })
  .catch((err) => {
    console.log(err);
  });
app.use("/", userrouter);
app.use("/", contactrouter);
app.use("/product", productrouter);
app.use("/", adminrouter);
