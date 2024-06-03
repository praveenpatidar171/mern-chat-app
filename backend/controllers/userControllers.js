const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const { User } = require('../schemas/user')
const generateToken = require('../config/generateToken')


const signupUser = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("Please fill all the fields");
    }
    const userexist = await User.findOne({ email: email })
    if (userexist) {
        res.status(400);
        throw new Error("Email Already Used");
    }

    const user = await User.create({
        name, email, password, pic
    })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Failed to create the User")
    }

})



const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    const matchpassword = async (tobematchedpassword) => {
        return await bcrypt.compare(tobematchedpassword, user.password);
    }

    if (user && (await matchpassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    }
    else {
        res.status(400);
        throw new Error("Something is wrong in credentials check again!!")
    }
})

// /api/user?search=praveen
const allUsers = asyncHandler(async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },
            { email: { $regex: req.query.search, $options: 'i' } },
        ],
    } : {}

    // find({_id : {$ne: req.user._id}}); 
    const users = await User.find(keyword).find({_id : {$ne: req.user._id}});;

    res.json({users: users});

})

module.exports = { signupUser, authUser, allUsers }