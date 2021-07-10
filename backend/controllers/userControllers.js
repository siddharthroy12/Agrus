const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const generateToken = require('../utils/genToken')

// @desc Register user & send token back
// @route POST /api/user/register
// @access Public
const registerUser = asyncHandler(async (req, res) => {
	let { username, password } = req.body

  if (username === undefined || password === undefined) {
    res.status(400)
    throw new Error('Provide all feilds')
  }

	// Username and password must not be empty
	if (username.trim() === '' || password.trim() === '') {
    res.status(400)
    throw new Error('Provide all fields')
  }

	// Username must be 1 - 20 length and only contains numbers and letters
  if (username < 1 || username > 20) {
		res.status(400)
    throw new Error('Username must be 1-20 characters')
  } else if (/\W/.test(username)) {
    res.status(400)
    throw new Error('Username can only have numbers and letters')
  }

	username = username.trim()
	
	// Password must be bigger than 4 length and only contains numbers and letters
  if (password < 4) {
    res.status(400)
    throw new Error('Password is too short')
  } else if (/\W/.test(username)) {
    res.status(400)
    throw new Error('Password can only have numbers and letters')
  }

	password = password.trim()

	const userExist = await User.findOne({ username })

	if (userExist) {
    res.status(400)
    throw new Error('Username is taken')
  }

  try {
    const newUser = await User.create({
      username,
      password
    })

    res.status(201).json({
      token: generateToken(newUser._id),
    })

  } catch(error) {
    res.status(500)
    throw new Error('Error in creating account')
  }
})

// @decs Login User
// @route POST /api/user/login
// @access Public
const loginUser = asyncHandler(async (req, res) => {
    const { username, password } = req.body
    
    if (username === undefined || password === undefined) {
      res.status(400)
      throw new Error('Provide all feilds')
    }

    const user = await User.findOne({ username })

    if (!user) {
      res.status(400)
      throw new Error('Username not found')
    }

    if (user.disabled) {
      res.status(404)
      throw new Error('Account has been disabled')
    }
    
    if ((await user.matchPassword(password))) {
      res.json({
      	token: generateToken(user._id)
      })
    } else {
      res.status(400)
      throw new Error('Invalid password')
    }
})

// @decs Authenticate User
// @route GET /api/user/authenticate
// @access Private
const authenticateUser = asyncHandler(async (req, res) => {
    res.status(200)
    res.json(req.user)
})

// @desc Get User
// @route GET /api/user/:username
// @access Public
const getUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username }, 'username avatar posts comments disabled createdAt')

		if (!user) {
        res.status(404)
        throw new Error('User not found')
    } else if (user.disabled) {
			res.status(404)
			throw new Error('User not found')
    }

		res.json({
			username: user.username,
			avatar: user.avatar,
			posts: user.posts,
			comments: user.comments,
			createdAt: user.createdAt,
		})
})

// @desc Disable User
// @route DELETE /api/user/:username
// @access Private/Admin
const disableUser = asyncHandler(async (req, res) => {
    const user = await User.findOne({username: req.params.username})
    
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    } else if (user.disabled) {
			res.status(400)
			throw new Error('User is already disabled')
		} else {
      user.disabled = true
      await user.save()
      res.json({message: 'User Disabled'})
    }
})

// @desc Enable User
// @route PUT /api/user/:username
// @access Private/Admin
const enableUser = asyncHandler(async (req, res) => {
		const user = await User.findOne({username: req.params.username})
    
    if (!user) {
      res.status(404)
      throw new Error('User not found')
    } else if (!user.disabled) {
			res.status(400)
			throw new Error('User is already enabled')
		} else {
      user.disabled = false
      await user.save()
      res.json({message: 'User Enabled'})
    }
})

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  getUser,
  disableUser,
  enableUser,
}