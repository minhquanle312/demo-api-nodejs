const mongoose = require('mongoose')

const councilSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Council must have a name'],
    },
    chairman: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Council must have a chairman'],
    },
    secretary: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Council must have a secretary'],
    },
    member: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Council must have a member'],
    },
    reviewer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Council must have a reviewer'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

councilSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'chairman',
    select: 'name',
  })
    .populate({
      path: 'secretary',
      select: 'name',
    })
    .populate({
      path: 'member',
      select: 'name',
    })
    .populate({
      path: 'reviewer',
      select: 'name',
    })

  next()
})

const Council = mongoose.model('Council', councilSchema)

module.exports = Council
