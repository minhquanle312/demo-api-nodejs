const mongoose = require('mongoose')
// const AppError = require('../utils/appError')

const Speciality = require('./specialityModel')

const departmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Department must have name'],
    },
    code: {
      type: String,
      unique: true,
      required: [true, 'Department must have code'],
    },
    foundationDay: {
      type: Date,
      required: [true, 'Department must have foundation day'],
    },
    description: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

departmentSchema.virtual('specialities', {
  ref: 'Speciality',
  foreignField: 'id_department',
  localField: '_id',
  options: { select: 'name code -id_department' },
})

departmentSchema.post('remove', { document: true, query: false }, function () {
  // console.log(department)
  Speciality.remove({ id_department: this._id }).exec()
})

const Department = mongoose.model('Department', departmentSchema)

module.exports = Department
