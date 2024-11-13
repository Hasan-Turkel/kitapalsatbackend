"use strict"

const router = require('express').Router()
/* ------------------------------------------------------- */
// routes/user:

const { isAdmin, isLogin } = require('../middlewares/permissions')
const user = require('../controllers/user')

// URL: /users

router.route('/')
    .get(isAdmin, user.list)
    .post(isAdmin, user.create)

router.route('/:id')
    .get(isLogin, user.read)
    .put(isLogin, user.update)
    .patch(isLogin, user.update)
    .delete(isAdmin, user.delete)

/* ------------------------------------------------------- */
module.exports = router