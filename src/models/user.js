"use strict";

const { mongoose } = require("../configs/dbConnection");
/* ------------------------------------------------------- *
{
    "fullname": "admin",
    "password": "aA*123456",
    "email": "admin@site.com",
    "is_superadmin": true
}

{
    "username": "test",
    "password": "aA*123456",
    "email": "test@site.com",
    "is_superadmin": false
}
/* ------------------------------------------------------- */
// User Model:

const UserSchema = new mongoose.Schema(
  {
    fullname: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },

    password: {
      type: String,
      trim: true,
      required: true,
    },
    city: {
      type: {value:String, label:String},
      trim: true,
      required: true,
    },
    district: {
      type: {value:String, label:String},
      trim: true,
      required: true,
    },

    is_superadmin: {
      type: Boolean,
      default: false,
    },
  },
  { collection: "users", timestamps: true }
);

/* ------------------------------------------------------- */
// Schema Configs:

const passwordEncrypt = require("../helpers/passwordEncrypt");

UserSchema.pre(["save", "updateOne"], function (next) {
  // get data from "this" when create;
  // if process is updateOne, data will receive in "this._update"
  const data = this?._update || this;

  // email@domain.com
  const isEmailValidated = data.email
    ? /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(data.email) // test from "data".
    : true;

  if (isEmailValidated) {
    if (data?.password) {
      // pass == (min 1: lowerCase, upperCase, Numeric, @$!%*?& + min 8 chars)
      const isPasswordValidated =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(
          data.password
        );

      if (isPasswordValidated) {
        this.password = data.password = passwordEncrypt(data.password);
        this._update = data; // updateOne will wait data from "this._update".
      } else {
        next(new Error("Password not validated."));
      }
    }

    next(); // Allow to save.
  } else {
    next(new Error("Email not validated."));
  }
});

module.exports = mongoose.model("User", UserSchema);
