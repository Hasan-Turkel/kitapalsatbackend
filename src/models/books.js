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

const BookSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },

    author: {
      type: String,
      trim: true,
      required: true,
    },

    bookStore: {
      type: String,
      trim: true,
      required: true,
    },
    publishmentYear: {
      type: String,
      trim: true,
      required: true,
    },
    description: {
      type: String,
      trim: true,
      required: true,
    },

    photo: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    price: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "books", timestamps: true }
);

module.exports = mongoose.model("Book", BookSchema);
