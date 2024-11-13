"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/auth:

const auth = require('../controllers/auth')

// URL: /auth

router.post('/login', auth.login) // SimpleToken
router.post('/register', auth.register) // SimpleToken 

/* ------------------------------------------------------- */
module.exports = router