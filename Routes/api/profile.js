const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const request = require('request')
const config = require('config')
const auth = require('../../middleware/auth')
const Profile = require('../../models/Profile')
const User = require('../../models/User')

// @route  GET api/profile/self
// @desc   get Current user profile
// @access Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    )

    if (!profile) {
      return res
        .status(400)
        .json({ message: 'There is no profile for this user' })
    }

    res.json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      message: 'server error',
    })
  }
})

// @route  POST api/profile/
// @desc   create or update user profile
// @access Private
router.post(
  '/',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      })
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body

    // Build profile object
    const profileFields = {
      user: req.user.id,
    }

    if (company) profileFields.company = company
    if (website) profileFields.website = website
    if (location) profileFields.location = location
    if (bio) profileFields.bio = bio
    if (status) profileFields.status = status
    if (githubusername) profileFields.githubusername = githubusername
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim())
    }

    profileFields.social = {}

    if (youtube) profileFields.social.youtube = youtube
    if (twitter) profileFields.social.twitter = twitter
    if (facebook) profileFields.social.facebook = facebook
    if (linkedin) profileFields.social.linkedin = linkedin
    if (instagram) profileFields.social.instagram = instagram

    try {
      let profile = await Profile.findOne({ user: req.user.id })

      // if profile found update the profile
      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        )

        return res.status(200).json(profile)
      }

      // if not create profile
      profile = new Profile(profileFields)

      await profile.save()

      res.status(201).json(profile)
    } catch (error) {
      console.error(error.message)
      res.status(500).json({
        message: 'Server error',
      })
    }
  }
)

// @route  GET api/profile/
// @desc   Get all profiles
// @access Public
router.get('/', async (req, res) => {
  try {
    const profiles = await Profile.find().populate('user', ['name', 'avatar'])

    res.status(200).json({
      totalResults: profiles.length,
      profiles,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      message: 'Server Error',
    })
  }
})

router.get('/user/:user_id', async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['name', 'avatar'])

    if (!profile)
      return res.status(400).json({
        message: 'Profile not found',
      })

    res.status(200).json(profile)
  } catch (error) {
    console.error(error.message)
    console.log(error)

    if (err.kind == 'ObjectId') {
      return res.status(400).json({
        message: 'Profile not found',
      })
    }

    res.status(500).json({
      message: 'Server Error',
    })
  }
})

// @route  DELETE api/profile
// @desc   Delete profile , user & posts
// @access Private
router.delete('/', auth, async (req, res) => {
  try {
    // todo - Remove Posts

    // Remove profile
    await Profile.findByIdAndRemove({ user: req.user.id })
    // Remove user
    await User.findByIdAndRemove({ _id: req.user.id })

    res.status(200).json({ message: 'User deleted' })
  } catch (error) {
    console.error(error.message)
    re.status(500).json({ message: 'Server Error' })
  }
})

// @route  PUT api/profile/experience
// @desc   update profile experience
// @access Private
router.put(
  '/experience',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0] })
    }

    const { title, company, location, from, to, current, description } =
      req.body

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.experience.unshift(newExp)

      await profile.save()
      res.status(200).json(profile)
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ message: 'Server Error' })
    }
  }
)

// @route  DELETE api/profile/experience/:exp_id
// @desc   Delete profile experience
// @access Private
router.delete('/experience/:exp_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id)

    if (removeIndex === -1) {
      return res.status(404).json({
        message: 'There is no experience with this ID',
      })
    }

    profile.experience.splice(removeIndex, 1)

    await profile.save()

    res.status(200).json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @route  PUT api/profile/education
// @desc   update profile education
// @access Private
router.put(
  '/education',
  [
    auth,
    [
      check('school', 'School is required').not().isEmpty(),
      check('degree', 'Degree is required').not().isEmpty(),
      check('fieldofstudy', 'Field of study  is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array()[0] })
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body

    console.log(req.body)

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    }

    try {
      const profile = await Profile.findOne({ user: req.user.id })
      profile.education.unshift(newEdu)

      await profile.save()
      res.status(200).json(profile)
    } catch (error) {
      console.error(error.message)
      res.status(500).json({ message: 'Server Error' })
    }
  }
)

// @route  DELETE api/profile/education/:edu_id
// @desc   Delete profile education
// @access Private
router.delete('/education/:edu_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id })

    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id)

    if (removeIndex === -1) {
      return res.status(404).json({
        message: 'There is no education with this ID',
      })
    }

    profile.education.splice(removeIndex, 1)

    await profile.save()

    res.status(200).json(profile)
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: 'Server Error' })
  }
})

// @route  GET api/profile/github/:username
// @desc   Get user repos from github API
// @access Public
router.get('/github/:username', async (req, res) => {
  try {
    const options = {
      uri: `https://api.github.com/users/${
        req.params.username
      }/repos?per_page=5&sort=created:asc&client_id=${config.get(
        'githubClientID'
      )}&client_secret=${config.get('githbSecret')}`,
      method: 'GET',
      headers: { 'user-agent': 'node.js' },
    }

    request(options, (error, response, body) => {
      if (error) console.error(error)

      if (response.statusCode !== 200) {
        return res.status(404).json({
          message: 'No github profile found',
        })
      }

      res.status(200).json(JSON.parse(body))
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ message: 'Server Error' })
  }
})

module.exports = router
