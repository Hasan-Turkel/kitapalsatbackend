"use strict";

const Book = require("../models/books");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "List Books"
            
        */

    // const filters = req.user?.is_superadmin ? {} : { _id: req.user?._id };

    const data = await res.getModelList(
      Book,
      { isDeleted: false, isActive: true },
      "user_id"
    );
    // Book.find({isDeleted:false, isActive:true }).populate(
    //   "user_id"
    // );
    res.status(200).send({
      error: false,
      data: data.data,
      count: data.dataCount,
    });
  },
  listPersonalBooks: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "List Books"
          
        */

    const data = await Book.find({
      user_id: req.user?._id,
      isDeleted: false,
    }).populate("user_id");
    res.status(200).send({
      error: false,
      data,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "Create Book"
            #swagger.parameters['body'] = {
                in: 'body',
               
            }
        */
      const data = await Book.create({ ...req.body, user_id: req.user?._id });
      res.status(201).send({
        error: false,
        data,
      });
    
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "Get Single Book"
        */

    const data = await Book.findOne({
      _id: req.params.id,
    }).populate("user_id");
    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "Update Book"
            #swagger.description = "Look to <b>'Models/Personnel'</b> for parameters."
            #swagger.parameters['body'] = {
                in: 'body',
               
            }
        */

    const currentBook = await Book.findOne({ _id: req.params.id });
    if (req?.user?._id != currentBook?.user_id) {
      throw new Error("Bu işlem için yetkili değilsiiniz.");
    }
    const data = await Book.updateOne({ _id: req.params.id }, req.body);
    res.status(202).send({
      error: false,
      data,
      newData: await Book.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Books"]
            #swagger.summary = "Delete Book"
        */
    const currentBook = await Book.findOne({ _id: req.params.id });

    const data = await Book.deleteOne({ _id: req.params.id });
    if (currentBook?.photo) {
      await cloudinary.uploader.destroy(
        currentBook?.photo?.split("/").pop().split(".")[0]
      );
    }

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
