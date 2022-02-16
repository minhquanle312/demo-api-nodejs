const express = require('express')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = express.Router()
router.get('/check-signin', authController.protect, authController.checkSignin)
router.post('/signup', authController.signup)
router.post('/login', authController.login)

router.post('/forgot-password', authController.forgotPassword)
router.patch('/reset-password/:token', authController.resetPassword)

router.use(authController.protect)

router.patch('/update-my-password/:id', authController.updatePassword)
router.get('/me', userController.getMe, userController.getUser)
router.patch('/update-me', userController.updateMe)
router.delete('/delete-me', userController.deleteMe)

// router.use(authController.restrictTo('admin'))

router.get('/trash-user', userController.getAllUsers)

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser, userController.createOneUserv1)
  .patch(userController.updateClassUser)
  .delete(userController.deleteManyUsers)

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router
