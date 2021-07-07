const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const auth = require('../../middleware/auth')
const User = require('../../models/User')
const Profile = require('../../models/Profile')
const Post = require('../../models/Post')

// @route  POST api/posts
// @desc   Create a post
// @access Private
router.post(
  '/',
  [auth, [check('text', 'Text is required').not().isEmpty()]],
  async (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()[0],
      })
    }

    try {
      const user = await User.findById(req.user.id).select('-password')

      const newPost = new Post({
        text: req.body.text,
        name: user.name,
        avatar: user.avatar,
        user: req.user.id,
      })

      const post = await newPost.save()

      res.status(201).json(post)
    } catch (error) {
      console.error(error.message)
      res.status(500).json({
        message: 'Server Error',
      })
    }
  }
)

// @route  GET api/posts
// @desc   Get all posts
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 })
    res.status(200).json({
      totalResults: posts.length,
      posts,
    })
  } catch (error) {
    console.error(error.message)
    res.status(500).json({
      message: 'Server Error',
    })
  }
})

// @route  GET api/posts/:id
// @desc   Get post by ID
// @access Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      })
    }

    res.status(200).json(post)
  } catch (error) {
    console.error(error.message)

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Post not found',
      })
    }

    res.status(500).json({
      message: 'Server Error',
    })
  }
})

// @route  DELETE api/posts
// @desc   Delete a post
// @access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: 'Post not found',
      })
    }

    // Check User
    if (post.user.toString() !== req.user.id) {
      return res.status(401).json({
        message: 'User not authorized',
      })
    }

    await post.remove()

    res.status(200).json({ message: 'Post deleted' })
  } catch (error) {
    console.error(error.message)

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        message: 'Post not found',
      })
    }

    res.status(500).json({
      message: 'Server Error',
    })
  }
})

module.exports = router
