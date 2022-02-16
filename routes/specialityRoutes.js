const express = require('express')
const specialityController = require('../controllers/specialityController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(specialityController.getAllSpecialities)
  .post(specialityController.createSpeciality)

router
  .route('/:id')
  .get(specialityController.getSpeciality)
  .patch(specialityController.updateSpeciality)
  .delete(specialityController.deleteSpeciality)

module.exports = router
