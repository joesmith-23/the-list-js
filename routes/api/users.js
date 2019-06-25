const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { check, validationResult } = require('express-validator');

const User = require('../../models/Users');
const auth = require('../../middleware/auth');

// @route   POST api/users
// @desc    Register User
// @access  Public
router.post('/', 
[
    check('firstName', 'A first name is required').not().isEmpty(),
    check('lastName', 'A last name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
],  
async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // Pulling out data from the request body 
    const { firstName, lastName, email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        // If user exists throw an error
        if (user) {
            return res.status(400).json({ errors: [{ msg: 'User already exists' }] });
        }

        // Create new user object
        user = new User({
            firstName,
            lastName,
            email,
            password
        });

        // Password encrypting
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        // Save new user object with encrypted password
        await user.save();

        // JWT 
        // The payload is the data that is being sent 
        // This one confirms that the user is logged in and can access private areas
        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            config.get('jwtSecret'),
            // { expiresIn: 360000 }, // Optional - add back at a reasonable amount when deploying
            (err, token) => {
            if (err) throw err;
            res.json({ token });
            }
        );
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


// @route    GET api/users/auth
// @desc     Get currently logged in user's info
// @access   Private
router.get('/auth', auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select('-password');
      res.json(user);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });


// @route   POST api/users/login
// @desc    Login user
// @access  Public
router.post(
    '/login',
    [
      check('email', 'Please include a valid email').isEmail(),
      check('password', 'Password is required').exists()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
    
        const { email, password } = req.body;
    
        try {
            let user = await User.findOne({ email });
    
            if (!user) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
    
            console.log(isMatch);
            if (!isMatch) {
            return res
                .status(400)
                .json({ errors: [{ msg: 'Invalid Credentials' }] });
            }
    
            const payload = {
            user: {
                id: user.id
            }
            };
    
            jwt.sign(
            payload,
            config.get('jwtSecret'),
            { expiresIn: 360000 },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
            );
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server error');
        }
        }
  );

module.exports = router;