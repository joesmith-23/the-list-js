const express = require('express');
const router = express.Router();

// @route   GET api/lists
// @desc    Test route
// @access  Public

router.get('/', (req, res) => res.send('List route'));


module.exports = router;