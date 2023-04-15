const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  uname: {
    type: String,
    require: true,
    validate(value) {
      if (!validator.isAlpha(value)) {
        throw new Error("User name is not valide");
      }
    },
  },
  email: {
    type: String,
    require: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is not valide");
      }
    },
  },
  pass: {
    type: String,
    require: true,
    //   validate(value) {
    //     if (!validator.isStrongPassword(value, [{ minLength: 8 }])) {
    //       throw new Error("Password min length 8  require");
    //     }
    //   },
  },
  pnumber: {
    type: Number,
    require: true,
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
