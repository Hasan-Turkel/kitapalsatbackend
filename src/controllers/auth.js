"use strict";

// Auth Controller:

const User = require("../models/user");
const passwordEncrypt = require("../helpers/passwordEncrypt");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Login"
            #swagger.description = 'Login with username (or email) and password for get simpleToken'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "email": "test@email.com",
                    "password": "1234",
                }
            }
        */

    const { email, password } = req.body;

    if (email && password) {
      const user = await User.findOne({ email });

      if (user && user.password == passwordEncrypt(password)) {
        // TOKEN:
        const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY);

        res.send({
          error: false,
          bearer: accessToken,
          user,
        });
      } else {
        res.errorStatusCode = 401;
        throw new Error("Wrong username/email or password.");
      }
    } else {
      res.errorStatusCode = 401;
      throw new Error("Please enter username/email and password.");
    }
  },

  register: async (req, res) => {
    /*
            #swagger.tags = ["Authentication"]
            #swagger.summary = "Register"
            #swagger.description = 'Register with username, email) and password for get simpleToken'
            #swagger.parameters["body"] = {
                in: "body",
                required: true,
                schema: {
                    "username": "test",
                    "email": "test@mail.com",
                    "password": "1234",
                }
            }
        */

    req.body.is_superadmin = false;

    const user = await User.create(req.body);

    const accessToken = jwt.sign(user.toJSON(), process.env.ACCESS_KEY);

    res.send({
      error: false,
      bearer: accessToken,
      user,
    });
  },
};
