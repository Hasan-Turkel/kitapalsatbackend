"use strict";

const User = require("../models/user");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            
        */

    const filters = req.user?.is_superadmin ? {} : { _id: req.user?._id };

    const data = await User.find(filters);

    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
            
                }
            }
        */

    // Disallow setting admin

    req.body.is_superadmin = false

    const data = await User.create(req.body);

    res.status(201).send({
      error: false,
      ...data._doc,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single User"
        */

    const filters = (req.user?.is_superadmin) ? { _id: req.params.id } : { _id: req.user._id }

    const data = await User.findOne(filters);

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update User"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                  
                  
                }
            }
        */

    const filters = (req.user?.is_superadmin) ? { _id: req.params.id } : { _id: req.user._id }
    req.body.is_superadmin = req.user?.is_superadmin
      ? req.body.is_superadmin
      : false;

    if (req.body.key) {
      const user = await User.findOne(filters);

      if (req.body.key == "people") {
        const filteredPeople = user.people.filter(
          (item) => item.name == req.body.character.name
        );

        if (filteredPeople.length) {
          throw new Error("The people is already in your favorites");
        } else {
          user.people.push(req.body.character);
          const data = await User.updateOne(
            filters,
            { people: user.people },
            { runValidators: true }
          );
          res.status(202).send({
            error: false,
            data,
            new: await User.findOne(filters),
          });
        }
      } else if (req.body.key == "planets") {

       
        const filteredPlanets = user.planets.filter(
          (item) => item.name == req.body.planet.name
        );

        if (filteredPlanets.length) {
          throw new Error("The planet is already in your favorites");
        } else {

          user.planets.push(req.body.planet);
          const data = await User.updateOne(
            filters,
            { planets: user.planets },
            { runValidators: true }
          );
          res.status(202).send({
            error: false,
            data,
            new: await User.findOne(filters),
          });
        }
      }
    } else {
      const data = await User.updateOne(filters, req.body, {
        runValidators: true,
      });

      res.status(202).send({
        error: false,
        data,
        new: await User.findOne(filters),
      });
    }
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete User"
        */

    const filters = req.user?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.user._id };

    const data = await User.deleteOne(filters);

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
