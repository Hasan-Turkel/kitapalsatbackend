"use strict";

const router = require("express").Router()
/* ------------------------------------------------------- */
// routes/book:

const { isAdmin, isLogin } = require("../middlewares/permissions");
const book = require("../controllers/book");

// URL: /users

router
  .route("/")
  .get(book.list)
  .post(isLogin, book.create);
router.route("/personalBooks").get(book.listPersonalBooks);

router
  .route("/:id")
  .get(book.read)
  .put(isLogin, book.update)
  .delete(isAdmin, book.delete);

/* ------------------------------------------------------- */
module.exports = router;
