const mongoose = require('mongoose')

const specialitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: [true, 'Speciality must have name'],
    },
    code: {
      type: String,
      unique: true,
      // required: [true, 'Speciality must have code'],
    },
    description: String,
    id_department: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
      required: [true, 'Speciality must belong to a department'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

specialitySchema.pre('save', async function (next) {
  let num = 0

  if (!this.code)
    this.code = await this.name
      .toLowerCase()
      .replace(/đ/g, 'd')
      .split(' ')
      .map((char) => char[0].toUpperCase())
      .join('')

  const regex = `^(${this.code})|^(${this.code})[0-9]`
  const re = new RegExp(regex, 'g')

  const count = await this.model('Speciality').count({ code: re })
  num = count

  this.code = await this.code.concat(num || '')

  next()
})

const Speciality = mongoose.model('Speciality', specialitySchema)

module.exports = Speciality
