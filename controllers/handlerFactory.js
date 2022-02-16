const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const APIFeatures = require('../utils/apiFeatures')

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({ _id: req.params.id })

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    doc.remove()

    res.status(200).json({
      success: true,
      data: null,
    })
  })

exports.deleteMany = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.deleteMany({ _id: { $in: req.body.userIds } })

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      success: true,
      message: 'success',
    })
  })

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      success: true,
      result: doc,
    })
  })

exports.updateMany = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.updateMany(
      { _id: { $in: req.body.userIds } },
      { id_class: req.body.id_class }
    )

    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      success: true,
      message: 'success',
    })
  })

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.create(req.body)

    res.status(201).json({
      success: true,
      result: doc,
    })
    next()
  })

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id)
    if (popOptions) query = query.populate(popOptions)
    const doc = await query
    if (!doc) {
      return next(new AppError('No document found with that ID', 404))
    }

    res.status(200).json({
      success: true,
      result: doc,
    })
  })

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // WARNING:To allow for nested GET reviews on Tour (small hack :))
    // TODO: MAY BE MOST VALUE ON MY PROJECT
    let filter = {}
    // if (req.params.tourId) filter = { tour: req.params.tourId }
    if (req.originalUrl === '/api/user/trash-user') {
      filter = { active: false }
    } else if (req.originalUrl === '/api/user') {
      filter = { active: { $ne: false } }
    }
    // console.log(req.originalUrl)

    // EXECUTE QUERY
    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate()
    const doc = await features.query

    // RESPONSE
    res.status(200).json({
      success: true,
      length: doc.length,
      result: doc,
    })
  })
