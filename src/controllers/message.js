"use strict";

const Message = require("../models/messages");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            
        */

    const data = await Message.find({
      participants: {
        $elemMatch: {
          user_id: req?.user?._id,
        },
      },
    }).populate({
      path: "book_id", // book_id'yi populate ediyoruz
      populate: {
        path: "user_id", // book_id içindeki user_id'yi populate ediyoruz
        model: "User", // user_id'nin bağlı olduğu model (User)
      },
    });

    res.status(200).send({
      error: false,
      data,
    });
  },
  isThereMessage: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "List Users"
            
        */

    const data = await Message.find({
      participants: {
        $elemMatch: {
          user_id: req?.user?._id,
        },
      },
      book_id: req.params.id,
    });

    let result = false


    if (data.length==1 ){
      result = true
    }
    res.status(200).send({
      error: false,
      result,
      id: result?data[0]?._id : 1
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Create Message"
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

    const updatedMessages = {
      ...req?.body?.messages[0],
      user_id: req?.user?._id,
    };
    const updatedParticipants = [
      { ...req.body.participants[0], user_id: req?.user?._id },
      req.body.participants[1],
    ];

    // console.log(updatedParticipants, updatedMessages)

    const data = await Message.create({
      ...req.body,
      messages: updatedMessages,
      participants: updatedParticipants,
    });

    res.status(201).send({
      error: false,
      ...data._doc,
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Get Single Message"
        */

    const data = await Message.findOne({ _id: req.params.id });

    const control = data?.participants.filter(
      (item) => item?.user_id == req?.user?._id
    );

    if (control?.length == 0)
      throw new Error("Bu işlem için yetkili değilsiniz.");

    await Message.updateOne(
      { "participants.user_id": req.user?.user_id },
      { $set: { "participants.$.lastSeen": new Date() } }
    );

    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Update Message"
            #swagger.parameters['body'] = {
                in: 'body',
                required: true,
                schema: {
                    "username": "test",
                    "password": "1234",
                    "email": "test@site.com",
                    "people":[],
                    "planets":[]
                  
                }
            }
        */

    const message = await Message.findOne({ _id: req.params.id });

    const control = message?.participants.filter(
      (item) => item?.user_id == req?.user?._id
    );

    if (control?.length == 0)
      throw new Error("Bu işlem için yetkili değilsiniz.");

    message?.messages?.push({
      user_id: req?.user?._id,
      message: req?.body?.message,
      date: new Date(),
    })


    const data = await Message.updateOne(
      { _id: req.params.id },
      { messages: message?.messages },
      {
        runValidators: true,
      }
    );

    res.status(202).send({
      error: false,
      data: await Message.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Users"]
            #swagger.summary = "Delete Message"
        */

    const filters = req.message?.is_superadmin
      ? { _id: req.params.id }
      : { _id: req.message._id };

    const data = await Message.deleteOne(filters);

    res.status(data.deletedCount ? 204 : 404).send({
      error: !data.deletedCount,
      data,
    });
  },
};
