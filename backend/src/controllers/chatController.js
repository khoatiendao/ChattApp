const chatModel = require("../models/chatModel");

// createChat
// findAllChat
// findChat

const createChat = async(req, res) => {
    const {firstId, secondId} = req.body;

    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstId, secondId]
            }})
        if(chat) {
            return res.status(200).json({chat: chat})
        }

        const newChat = new chatModel({
            members: [firstId, secondId]
        })

        const response = await newChat.save();
        res.status(200).json({response: response});

    } catch (error) {
        console.log(error);
        res.status(500);
    }
};

const findUserChat = async(req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: { $in: [userId] }
        });

        res.status(200).json(chats)
    } catch (error) {
        console.log(error);
        res.status(500)
    }
};

const findChats = async(req, res) => {
    const {firstId, secondId} = req.body;

    try {
        const chats = await chatModel.find({
            members: {
                $all: [firstId, secondId]
            }
        })

        res.status(200).json({chats: chats})
    } catch (error) {
        console.log(error);
        res.status(500)
    }
};

module.exports = {createChat, findUserChat, findChats}