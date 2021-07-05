const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.findById(req.user.id).select('-password')

    res.status(200).json({
      users,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      message: 'Server Error',
    })
  }
})

// @route  POST api/auth
// @desc   Authenticate user & get token
// @access Public
router.post(
  '/',
  [
    check('email', 'please provide a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req)
    //checking error
    if (!errors.isEmpty()) {
      return res.status(400).json({
        error: errors.array()[0],
      })
    }

    const { email, password } = req.body

    try {
      let user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          errors: [
            {
              message: 'Invalid Credentials',
            },
          ],
        })
      }

      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(400).json({
          errors: [
            {
              message: 'Invalid Credentials',
            },
          ],
        })
      }

      const payload = {
        user: {
          id: user.id,
        },
      }

      jwt.sign(
        payload,
        config.get('jwtSecret'),
        {
          expiresIn: 360000,
        },
        (err, token) => {
          if (err) throw err

          res.json({
            token,
          })
        }
      )
    } catch (error) {
      console.error(error.message)
      res.status(500).send({
        message: 'Server error',
      })
    }
  }
)

module.exports = router
