const express = require('express');
const router = express.Router();

// @route   GET api/groups
// @desc    Test route
// @access  Public

router.get('/', (req, res) => res.send('Group route'));


module.exports = router;