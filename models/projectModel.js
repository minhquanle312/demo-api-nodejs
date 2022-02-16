const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Project must have a name'],
    },
    url: {
      type: String,
      required: [true, 'Project must have a URL to you project'],
    },
    thumbnail: String,
    mark: {
      type: Number,
      min: 0,
      max: 10,
    },
    content: String,
    code: {
      type: String,
      unique: true,
    },
    id_user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a user'],
    },
    id_council: {
      type: mongoose.Schema.ObjectId,
      ref: 'Council',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

projectSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'id_user',
    select: 'name code',
  }).populate({
    path: 'id_council',
    select: 'name',
  })

  next()
})

const Project = mongoose.model('Project', projectSchema)

module.exports = Project
