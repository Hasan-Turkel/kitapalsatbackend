"use strict";

const router = require("express").Router();
const multer = require("multer");
/* ------------------------------------------------------- */
// routes/book:

const storage = multer.memoryStorage(); // Bellekte geçici depolama
const upload = multer({ storage: storage });

const { isAdmin, isLogin } = require("../middlewares/permissions");
const book = require("../controllers/book");

// URL: /users

router
  .route("/")
  .get(book.list)
  .post(isLogin, upload.single("file"), book.create);
router.route("/personalBooks").get(book.listPersonalBooks);

router
  .route("/:id")
  .get(book.read)
  .put(isLogin, upload.single("file"), book.update)
  .patch(isLogin, upload.single("file"), book.update)
  .delete(isAdmin, book.delete);

/* ------------------------------------------------------- */
module.exports = router;
