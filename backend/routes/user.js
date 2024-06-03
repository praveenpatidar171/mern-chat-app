const express = require('express')
const { signupUser, authUser, allUsers } = require('../controllers/userControllers')
const {protect} = require('../middleware/authMiddleware')
const router = express.Router()

router.post('/', signupUser);
router.post('/login', authUser);
router.get('/', protect, allUsers);

module.exports = router

