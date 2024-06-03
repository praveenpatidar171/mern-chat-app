const express = require('express')
const router = express.Router()
const userrouter = require('./user')
const chatrouter = require('./chat')
const messagerouter = require('./message')

router.use('/user', userrouter);
router.use('/chat', chatrouter);
router.use('/message', messagerouter)

module.exports = router