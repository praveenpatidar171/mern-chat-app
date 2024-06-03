const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { sendMessage, allMessages } = require('../controllers/messageController');
const router = express.Router();

//sending messages
router.post('/', protect, sendMessage);

//fetching all messages for a chat
router.get('/:chatId',protect, allMessages);


module.exports = router;