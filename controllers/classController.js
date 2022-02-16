const Class = require('../models/classModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllClasses = factory.getAll(Class)
exports.getClass = factory.getOne(Class, { path: 'users' })
exports.createClass = factory.createOne(Class)
exports.updateClass = factory.updateOne(Class)
exports.deleteClass = factory.deleteOne(Class)
