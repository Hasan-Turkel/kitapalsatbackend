"use strict";

const router = require("express").Router();
const multer = require("multer");
/* ------------------------------------------------------- */
// routes/message:


const { isAdmin, isLogin } = require("../middlewares/permissions");
const message = require("../controllers/message");

// URL: /users

router
  .route("/")
  .get(isLogin, message.list)
  .post(isLogin, message.create);

router
  .route("/isThereMessage/:id")
  .get(isLogin, message.isThereMessage)
router
  .route("/:id")
  .get(isLogin, message.read)
  .put(isLogin, message.update)
  .patch(isLogin, message.update)
  .delete(isAdmin, message.delete);

/* ------------------------------------------------------- */
module.exports = router;
