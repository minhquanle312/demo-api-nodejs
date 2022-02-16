const express = require('express')
const termController = require('../controllers/termController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(termController.getAllTerms)
  .post(termController.createTerm)

router
  .route('/:id')
  .get(termController.getTerm)
  .patch(termController.updateTerm)
  .delete(termController.deleteTerm)

module.exports = router
