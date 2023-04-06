const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  pass: {
    type: String,
    require: true,
  },
  pnumber: {
    type: String,
  },
  create_date: {
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

userSchema.pre("save", async function (next) {
  if (this.isModified("pass")) {
    this.pass = await bcrypt.hash(this.pass, 10);
  }
});

userSchema.methods.generateToken = async function (next) {
  try {
    const token = await jwt.sign({ _id: this._id }, process.env.SKEY);
    this.Tokens = await this.Tokens.concat({ token: token });
    await this.save();
    return token;
    next();
  } catch (error) {
    console.log(error);
  }
};
module.exports = mongoose.model("User", userSchema);
