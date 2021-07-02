const express = require('express')
const router = express.Router()

// @route  GET api/users
// @desc   Test route
// @access Public
router.get('/', (req, res) => res.send(200).json({ message: 'user route' }))

module.exports = router
