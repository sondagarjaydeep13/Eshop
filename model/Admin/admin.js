const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const adminSchema = new mongoose.Schema({
  adminname: {
    type: String,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error("user name is not valide");
      }
    },
  },
  email: {
    type: String,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valide");
      }
    },
  },
  pass: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  Tokens: [
    {
      token: {
        type: String,
      },
    },
  ],
});
adminSchema.pre("save", async function (next) {
  try {
    if (this.isModified("pass")) {
      this.pass = await bcrypt.hash(this.pass, 12);
    }
  } catch (error) {
    console.log(error);
  }
});
adminSchema.methods.genratetoken = async function (next) {
  const token = await jwt.sign({ _id: this._id }, process.env.ADMIN);
  this.Tokens = await this.Tokens.concat({ token: token });
  await this.save();
  return token;
};

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
