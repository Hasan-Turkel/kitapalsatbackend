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

const MessageSchema = new mongoose.Schema(
  {
    book_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    participants: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        lastSeen: String,
      },
    ],
    messages: [
      {
        user_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        date: String,
        message: String,
      },
    ],
  },
  { collection: "messages", timestamps: true }
);

module.exports = mongoose.model("Message", MessageSchema);
