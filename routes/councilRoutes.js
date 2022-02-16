const express = require('express')
const councilController = require('../controllers/councilController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(councilController.getAllCouncils)
  .post(councilController.createCouncil)

router
  .route('/:id')
  .get(councilController.getCouncil)
  .patch(councilController.updateCouncil)
  .delete(councilController.deleteCouncil)

module.exports = router
