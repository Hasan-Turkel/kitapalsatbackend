"use strict";

// app.use(authentication):

const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  const auth = req.headers?.authorization || null; // Token ...tokenKey... // Bearer ...accessToken...
  const tokenKey = auth ? auth.split(" ") : null; // ['Token', '...tokenKey...'] // ['Bearer', '...accessToken...']

  if (tokenKey && tokenKey[0] == "Bearer") {
    jwt.verify(
      tokenKey[1],
      process.env.ACCESS_KEY,
      (err, userData) => (req.user = userData)
    );
  }

  next();
};
