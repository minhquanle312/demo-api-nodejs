const Department = require('../models/departmentModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllDepartments = factory.getAll(Department)
exports.getDepartment = factory.getOne(Department, { path: 'specialities' })
exports.createDepartment = factory.createOne(Department)
exports.updateDepartment = factory.updateOne(Department)
exports.deleteDepartment = factory.deleteOne(Department)
