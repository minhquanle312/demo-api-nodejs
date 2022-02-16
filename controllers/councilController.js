const Council = require('../models/councilModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllCouncils = factory.getAll(Council)
exports.getCouncil = factory.getOne(Council)
exports.createCouncil = factory.createOne(Council)
exports.updateCouncil = factory.updateOne(Council)
exports.deleteCouncil = factory.deleteOne(Council)
