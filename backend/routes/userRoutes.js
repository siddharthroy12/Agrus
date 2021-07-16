const express = require('express')
const {
	registerUser,
  loginUser,
	authenticateUser,
	getUser,
	getAllUsers,
	updateUser,
	enableUser,
	disableUser
} = require('../controllers/userControllers')
const { protect, admin } = require('../middlewares/authMiddlewares')
const router = express.Router()

router.post('/register', registerUser)
router.put('/update', protect, updateUser)
router.post('/login', loginUser)
router.get('/authenticate', protect, authenticateUser)
router.route('/:username')
	.get(getUser)
	.put(protect, admin, enableUser)
	.delete(protect, admin, disableUser)

if (process.env.NODE_ENV === 'development') {
	router.get('/', getAllUsers)
}

module.exports =  router