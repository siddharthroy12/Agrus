const asyncHandler = require('express-async-handler')
const User = require('../models/User')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
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

    let objectToReturn = {
      ...newUser._doc,
      token: generateToken(newUser._id),
    }

    delete objectToReturn.password // Must not send password (Even if it's encrypted)

    res.status(201).json(objectToReturn)

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
      res.status(404)
      throw new Error('Username not found')
    }

    if (user.disabled) {
      res.status(404)
      throw new Error('Account has been disabled')
    }
    
    if ((await user.matchPassword(password))) {
      let objectToReturn = {
        ...user._doc,
        token: generateToken(user._id),
      }
  
      delete objectToReturn.password // Must not send password (Even if it's encrypted)
  
      res.json(objectToReturn)
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
  let username = req.params.username

  // Username must be 1 - 20 length and only contains numbers and letters
  if (username < 1 || username > 20) {
		res.status(400)
    throw new Error('Username must be 1-20 characters')
  } else if (/\W/.test(username)) {
    res.status(400)
    throw new Error('Username can only have numbers and letters')
  }

  const user = await User.findOne({ username: req.params.username }, 'username avatar disabled createdAt bio isAdmin')

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
		createdAt: user.createdAt,
    bio: user.bio,
    isAdmin: user.isAdmin
	})
})

// @desc Update User Profile
// @route PUT /api/user/update
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { avatar, bio } = req.body

  if (avatar === undefined && bio === undefined) {
    res.status(400)
    throw new Error('Nothing to update')
  }

  if (avatar !== undefined) {
    req.user.avatar = avatar
  }
  
  if (bio !== undefined) {
    req.user.bio = bio
  }

  await req.user.save()

  res.status(200)
  res.json(req.user)
})

// @desc Get All joined boards of user
// @route GET /api/user/joinedboards/get
// @access Private
const getUserJoinedBoards = asyncHandler(async (req, res) => {
  const userPopulated = await User.populate(req.user, {path: "joinedBoards"})

  res.status(200)
  res.json(userPopulated.joinedBoards)
})

// @desc Get saved post of user
// @route GET /api/user/savedposts/get
// @access Private
const getUserSavedPosts = asyncHandler(async (req, res) => {
  const userPopulated = await User.populate(req.user, { path: "savedPosts" })
  res.status(200)
  res.json(userPopulated.savedPosts)
})

// @desc Get Posts of user
// @route GET /api/user/:username/posts?page=1&perpage=2
// @access Public
const getUserPosts = asyncHandler(async (req, res) => {
  const { page, perpage } = req.query

	if (page === undefined || perpage === undefined) {
		res.status(400)
		throw new Error('Provide page and perpage')
	}

  const posts = await Post.find({author: req.params.username})
    .sort({ createdAt: -1 }).skip((page-1) * perpage).limit(perpage * 1)
  
  res.status(200)
	res.json(posts)
})

// @desc Get Comments of user
// @route GET /api/user/:username/comments?page=1&perpage=2
// @access Public
const getUserComments = asyncHandler(async (req, res) => {
  const { page, perpage } = req.query

	if (page === undefined || perpage === undefined) {
		res.status(400)
		throw new Error('Provide page and perpage')
	}

  const comments = await Comment.find({author: req.params.username})
    .sort({ createdAt: -1 }).skip((page-1) * perpage).limit(perpage * 1)
  
  res.status(200)
	res.json(comments)
})

// @desc Disable User
// @route DELETE /api/user/:username
// @access Private/Admin
const disableUser = asyncHandler(async (req, res) => {
  let username = req.params.username

  // Username must be 1 - 20 length and only contains numbers and letters
  if (username < 1 || username > 20) {
		res.status(400)
    throw new Error('Username must be 1-20 characters')
  } else if (/\W/.test(username)) {
    res.status(400)
    throw new Error('Username can only have numbers and letters')
  }  
    
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
  let username = req.params.username

  // Username must be 1 - 20 length and only contains numbers and letters
  if (username < 1 || username > 20) {
		res.status(400)
    throw new Error('Username must be 1-20 characters')
  } else if (/\W/.test(username)) {
    res.status(400)
    throw new Error('Username can only have numbers and letters')
  }

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

// @desc Get All Users
// @route GET /api/user/
// @access Public/Development
const getAllUsers = asyncHandler(async (req, res) => {
	if (process.env.NODE_ENV === 'development') {
		const users = await User.find({})
		res.status(200)
		res.json(users)
	} else {
		res.status(400)
		throw new Error('Not permitted')
	}
})

module.exports = {
  registerUser,
  loginUser,
  authenticateUser,
  getUser,
  getUserPosts,
  getUserComments,
  getUserJoinedBoards,
  getUserSavedPosts,
  getAllUsers,
  updateUser,
  disableUser,
  enableUser,
}