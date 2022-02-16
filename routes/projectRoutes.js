const express = require('express')
const projectController = require('../controllers/projectController')
const authController = require('../controllers/authController')

const router = express.Router()

router.use(authController.protect)

router
  .route('/')
  .get(projectController.getAllProjects)
  .post(projectController.setUserId, projectController.createProject)

router
  .route('/:id')
  .get(projectController.getProject)
  .patch(projectController.updateProject)
  .delete(projectController.deleteProject)

module.exports = router
