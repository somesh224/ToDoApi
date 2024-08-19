const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const user_jwt = require('../middleware/user_jwt');


router.get('/', user_jwt, async(req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.status(200).json({
            success: true,
            user: user
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        })
        next();
    }
})

router.post('/register',async (req, res, next) => {
    const { username, email, password } = req.body;

    if (!password) {
        return res.status(400).json({ msg: "Password is required" });
    }

    try {
        let user_exist = await User.findOne({ email: email });
        if (user_exist) {
            return res.status(400).json({
                success: false,
                msg: 'User already exists'
            });
        }

        let user = new User();

        user.username = username;
        user.email = email;

        const salt = await bcryptjs.genSalt(10);
        user.password = await bcryptjs.hash(password, salt);

        let size = 200;
        user.avatar = "https://gravatar.com/avatar/?s="+size+'&d=retro';

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;
            res.status(200).json({
                success: true,
                token: token
            });
        });

        // res.json({    Removed the second res.json call after generating the token to avoid sending multiple responses.
        //     success: true,          when trying to send two responses: one within the jwt.sign callback and another one immediately after. This results in an attempt to set headers after they have already been sent, which leads to unexpected behavior.
        //     msg: 'User registered',
        //     user: user
        // });

    } catch(err) {
        console.log(err);
    }
});

router.post('/login', async(req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;

    try {
        let user = await User.findOne({
            email: email
        });

        if (!user) {
            res.status(400).json({
                success: false,
                msg: 'User not exist go & register to continue.'
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                msg: 'Invalid Password.'
            });
        }

        const payload = {
            user: {
                id: user.id
            }
        }

        jwt.sign(payload, process.env.jwtUserSecret, {
            expiresIn: 360000
        }, (err, token) => {
            if(err) throw err;

            res.status(200).json({
                success: true,
                msg: 'User Logged in.',
                token: token,
                user: user
            });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            msg: 'Server Error'
        });
    }
});

module.exports = router;