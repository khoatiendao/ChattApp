const messageModel = require("../models/messageModel");

// create Message

const createMessage = async(req, res) => {
    const {chatId, senderId, text} = req.body;

    const message =  new messageModel({
        chatId, senderId, text
    });

    try {
        const response = await message.save();
        res.status(200).json({response: response});
    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

// get Message

const getMessage = async(req, res) => {
    const { chatId } = req.params;

    try {
        const messages = await messageModel.find({chatId});
        res.status(200).json({messages: messages})
    } catch (error) {
        console.log(error);
        res.status(500)
    }

};

module.exports = { createMessage, getMessage };