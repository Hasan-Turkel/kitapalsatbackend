"use strict";

const router = require("express").Router();
/* ------------------------------------------------------- */
// routes/:

// URL: /

// auth:
router.use("/auth", require("./auth"));

// user:
router.use("/users", require("./user"));
router.use("/books", require("./book"));
router.use("/messages", require("./message"));

// document:
router.use("/documents", require("./document"));

/* ------------------------------------------------------- */
module.exports = router;
