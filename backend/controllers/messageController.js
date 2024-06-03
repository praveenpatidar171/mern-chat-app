const asyncHandler = require('express-async-handler');
const { Message } = require('../schemas/message');
const { User } = require('../schemas/user');
const { Chat } = require('../schemas/chat');

// sending messages
const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        res.status(400);
        throw new Error("Please provide all the data");
    }
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }
    try {
        let message = await Message.create(newMessage);


        message = await message.populate("sender", "name, pic");
        message = await message.populate('chat');
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name pic email'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage: message
        })
        res.status(200).json(message);
    } catch (error) {
        res.status(400);
        throw new Error(error.message)
    }
})


//fetching all messages
const allMessages = asyncHandler(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId }).populate('sender', 'name, pic, email').populate('chat');
        res.status(200).json(messages);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
})



module.exports = { sendMessage, allMessages }