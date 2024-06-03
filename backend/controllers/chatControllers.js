const asyncHandler = require('express-async-handler');
const { Chat } = require('../schemas/chat');
const { User } = require('../schemas/user');
const { read } = require('fs');
const { error } = require('console');

// create 1 to 1 chat
const createChats = asyncHandler(async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        console.log("UserId param not send with request");
        return res.status(400);
    }

    // chat already exist or not 
    let ischat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },
            { users: { $elemMatch: { $eq: userId } } },
        ]
    }).populate('users', '-password').populate('latestMessage');

    // also populating the information of sender
    ischat = await User.populate(ischat, {
        path: "latestMessage.sender",
        select: "name pic email"
    })

    if (ischat.length > 0) {
        res.json(ischat[0]);
    }
    else {
        const chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId],
        };

        try {
            const newChat = await Chat.create(chatData);

            // sendind this chat to user

            const fullChat = await Chat.findOne({ _id: newChat._id }).populate("users", "-password");

            res.status(200).json(fullChat);


        } catch (error) {
            res.status(400);
            throw new Error(error.message);
        }

    }
})

// getting all the chats for a user

const getChats = asyncHandler(async (req, res) => {

    try {
        let chats = await Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password").populate("groupAdmin", "-password").populate("latestMessage").sort({ updatedAt: -1 });

        chats = await User.populate(chats, {
            path: "latestMessage.sender",
            select: "name pic email"
        })

        res.send(chats);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

// creating a group chat

const createGroupchat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).json({ message: "Fill all the fields" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.status(400).json({ message: "Atleast 2 users are required for a group chat" });
    }
    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        })
        // fetch the chat and send to user
        const fullgroupChat = await Chat.findOne({ _id: groupChat._id }).populate("users", "-password").populate("groupAdmin", "-password");
        res.status(200).json(fullgroupChat)
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

//rename group chat

const renameGroupchat = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    const updatedChat = await Chat.findByIdAndUpdate(

        chatId, {
        // chatName: chatName
        chatName,
    }, {
        new: true,
    }

    ).populate("users", "-password").populate("groupAdmin", "-password");

    //  const x = await Chat.findById({_id: chatId}).populate("users", "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        read.status(400);
        throw new Error(error.message);
    }
    else {
        res.status(200).json(updatedChat);
    }
})
// add someone in groupchat

const addGroupchat = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(chatId, {
        $push: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if(!added) {
        res.status(400);
        throw new Error("Chat Not Found");
    }
    else{
        res.status(200).json(added);
    }

})

// remove someone 

const removeGroupchat = asyncHandler(async(req,res)=>{
    const { chatId, userId } = req.body;

    const removed = await Chat.findByIdAndUpdate(chatId, {
        $pull: { users: userId }
    }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");

    if(!removed) {
        res.status(400);
        throw new Error("Chat Not Found");
    }
    else{
        res.status(200).json(removed);
    }

})

module.exports = { createChats, getChats, createGroupchat, renameGroupchat, addGroupchat, removeGroupchat }