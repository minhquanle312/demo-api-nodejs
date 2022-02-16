const Term = require('../models/termModel')
const factory = require('./handlerFactory')
// const catchAsync = require('../utils/catchAsync')

exports.getAllTerms = factory.getAll(Term)
exports.getTerm = factory.getOne(Term)
exports.createTerm = factory.createOne(Term)
exports.updateTerm = factory.updateOne(Term)
exports.deleteTerm = factory.deleteOne(Term)
