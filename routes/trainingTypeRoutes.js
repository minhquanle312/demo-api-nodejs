const express = require('express')
const trainingTypeController = require('../controllers/trainingTypeController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(trainingTypeController.getAllTrainingTypes)
  .post(trainingTypeController.createTrainingType)

router
  .route('/:id')
  .get(trainingTypeController.getTrainingType)
  .patch(trainingTypeController.updateTrainingType)
  .delete(trainingTypeController.deleteTrainingType)

module.exports = router
