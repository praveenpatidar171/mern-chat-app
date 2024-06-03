const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const {createChats, getChats, createGroupchat, renameGroupchat, removeGroupchat, addGroupchat} = require('../controllers/chatControllers')
const router = express.Router();


// creating a chat
router.post('/', protect, createChats);

// get user chats
router.get('/', protect, getChats);

// create group chat
router.post('/group', protect, createGroupchat);

//rename a group 
router.put('/rename', protect, renameGroupchat);

// add someone in group
router.put('/addgroup', protect, addGroupchat);

//remove someone from the group or leaving the group
router.put('/removegroup', protect, removeGroupchat);

// delete a group 

module.exports = router