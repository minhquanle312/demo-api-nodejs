const Speciality = require('../models/specialityModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllSpecialities = factory.getAll(Speciality)
exports.getSpeciality = factory.getOne(Speciality)
exports.createSpeciality = factory.createOne(Speciality)
exports.updateSpeciality = factory.updateOne(Speciality)
exports.deleteSpeciality = factory.deleteOne(Speciality)
