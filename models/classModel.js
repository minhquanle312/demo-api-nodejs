const mongoose = require('mongoose')

const User = require('./userModel')

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Class must have a name'],
    },
    code: {
      type: String,
      unique: true,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    id_department: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
      required: [true, 'Class must belong to department'],
    },
    id_speciality: {
      type: mongoose.Schema.ObjectId,
      ref: 'Speciality',
      required: [true, 'Class must belong to speciality'],
    },
    id_trainingType: {
      type: mongoose.Schema.ObjectId,
      ref: 'TrainingType',
      required: [true, 'Class must belong to training type'],
    },
    id_term: {
      type: mongoose.Schema.ObjectId,
      ref: 'Term',
      required: [true, 'Class must belong to training type'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

classSchema.virtual('users', {
  ref: 'User',
  foreignField: 'id_class',
  localField: '_id',
  options: { select: 'name id_department -id_class' },
})

classSchema.pre('save', function (next) {
  if (!this.code) this.code = this.name
  next()
})

classSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'id_department',
    select: 'name',
  })
    .populate({
      path: 'id_speciality',
      select: 'name',
    })
    .populate({
      path: 'id_trainingType',
      select: 'name',
    })
    .populate({
      path: 'id_term',
      select: 'start end',
    })

  next()
})

classSchema.post('remove', { document: true, query: false }, function () {
  User.updateMany({ id_class: this.id }, { id_class: undefined })
})

const Class = mongoose.model('Class', classSchema)

module.exports = Class
