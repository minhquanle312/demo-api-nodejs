const TrainingType = require('../models/trainingTypeModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllTrainingTypes = factory.getAll(TrainingType)
exports.getTrainingType = factory.getOne(TrainingType)
exports.createTrainingType = factory.createOne(TrainingType)
exports.updateTrainingType = factory.updateOne(TrainingType)
exports.deleteTrainingType = factory.deleteOne(TrainingType)
