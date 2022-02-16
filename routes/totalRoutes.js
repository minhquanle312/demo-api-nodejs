const express = require('express')
const totalController = require('../controllers/totalController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
    .route('/')
    .get(totalController.getTotal)

module.exports = router
