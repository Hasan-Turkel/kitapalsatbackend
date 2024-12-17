"use strict";

const Message = require("../models/messages");

module.exports = {
  list: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "List Messages"
            
        */

    const data = await Message.find({
      participants: {
        $elemMatch: {
          user_id: req?.user?._id,
          lastSeen: { $ne: "-1" },
        },
      },
    }).populate({
      path: "book_id", // book_id'yi populate ediyoruz
      populate: {
        path: "user_id", // book_id içindeki user_id'yi populate ediyoruz
        model: "User", // user_id'nin bağlı olduğu model (User)
      },
    }).populate('participants.user_id');

    res.status(200).send({
      error: false,
      data,
    });
  },
  newMessage: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "List Messages"
            
        */

    const data = await Message.find({
      participants: {
        $elemMatch: {
          user_id: req?.user?._id,
          lastSeen: { $ne: "-1" },
        },
      },
    });

    const filtered = data.filter(
      (messageModel) =>
        messageModel.participants?.filter(
          (participant) => participant?.user_id == req.user._id
        )[0].lastSeen == "0" ||
        new Date(
          messageModel.participants?.filter(
            (participant) => participant?.user_id == req.user._id
          )[0].lastSeen
        ).getTime() <
          new Date(
            messageModel.messages[messageModel.messages.length - 1].date
          ).getTime()
    );
    const isNewMessage = filtered?.length > 0 ? true : false;

    res.status(200).send({
      error: false,
      data: isNewMessage,
    });
  },
  isThereMessage: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "List Messages"
            
        */

    const data = await Message.find({
      participants: {
        $elemMatch: {
          user_id: req?.user?._id,
        },
      },
      book_id: req.params.id,
    });

    let result = false;

    if (data.length == 1) {
      result = true;
    }
    res.status(200).send({
      error: false,
      result,
      id: result ? data[0]?._id : 1,
    });
  },

  create: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "Create Message"
            #swagger.parameters['body'] = {
                in: 'body',
                
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
      data: { ...data._doc },
    });
  },

  read: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "Get Single Message"
        */

    const data = await Message.findOne({ _id: req.params.id }).populate('participants.user_id');

    const control = data?.participants.filter(
      (item) => item?.user_id._id == req?.user?._id
    );

    if (control?.length == 0)
      throw new Error("Bu işlem için yetkili değilsiniz.");
    res.status(200).send({
      error: false,
      data,
    });
  },

  update: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "Update Message"
            #swagger.parameters['body'] = {
                in: 'body',
              
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
      date: req?.body?.date,
    });

    const updatedParticipants = message.participants.map((participant) => {
      return participant?.user_id.toString() === req?.user._id.toString()
        ? { ...participant, lastSeen: req?.body?.date }
        : participant?.lastSeen == "-1"
        ? { ...participant, lastSeen: "0" }
        : participant;
    });
    message.participants = updatedParticipants;

    await Message.updateOne({ _id: req.params.id }, message, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data: await Message.findOne({ _id: req.params.id }),
    });
  },
  redOrDelete: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
            #swagger.summary = "Update Message"
            #swagger.parameters['body'] = {
                in: 'body',
               
            }
        */

    const message = await Message.findOne({ _id: req.params.id });

    const control = message.participants.filter(
      (item) => item?.user_id == req?.user?._id
    );

    if (control?.length == 0)
      throw new Error("Bu işlem için yetkili değilsiniz.");

    const updatedParticipants = message.participants.map((participant) => {
      if (participant.user_id.toString() === req.user._id.toString()) {
        // Eğer eşleşen user_id varsa, lastSeen'i güncelliyoruz
        participant.lastSeen = req.body.date;
      }
      return participant;
    });

    message.participants = updatedParticipants;

    await Message.updateOne({ _id: req.params.id }, message, {
      runValidators: true,
    });

    res.status(202).send({
      error: false,
      data: await Message.findOne({ _id: req.params.id }),
    });
  },

  delete: async (req, res) => {
    /*
            #swagger.tags = ["Messages"]
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
