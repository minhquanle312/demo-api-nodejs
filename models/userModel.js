const crypto = require('crypto')
const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please tell us your name'],
    },
    code: {
      type: String,
      unique: true,
      required: [true, 'Each user must have user code'],
    },
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      // lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    avatar: String,
    role: {
      type: String,
      enum: [1, 2, 3],
      required: [true, 'Each user must have a role'],
      // default: 'student',
    },
    gender: {
      type: String,
      enum: [0, 1],
      required: [true, 'Each user must have a gender'],
    },
    password: {
      type: String,
      required: [true, 'Please provide a password'],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Please confirm a password'],
      validate: {
        // This only works on CREATE and SAVE
        validator: function (el) {
          return el === this.password
        },
        message: 'Passwords are not the same',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    dateOfBirth: Date,
    phoneNumber: {
      type: String,
      validate: {
        validator: function (el) {
          const regex = /^0[0-9]{9}$/
          return regex.test(el)
        },
        message: 'Number phone is invalid',
      },
    },
    address: {
      ProvinceID: Number,
      ProvinceName: String,
      DistrictID: Number,
      DistrictName: String,
      WardCode: String,
      WardName: String,
    },
    school: String, // consider its
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
    id_class: {
      type: mongoose.Schema.ObjectId,
      ref: 'Class',
    },
    id_department: {
      type: mongoose.Schema.ObjectId,
      ref: 'Department',
    },
    // id_speciality: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Speciality',
    // },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true,
  }
)

userSchema.pre(/^find/, function (next) {
  // console.log(this)
  this.populate({
    path: 'id_class',
    // select: 'name id_term -id_speciality -id_trainingType -id_department',
    select: 'name id_term id_speciality id_trainingType id_department',
    // populate: {
    //   path: 'id_term',
    //   model: 'terms',
    // },
  }).populate({
    path: 'id_department',
    select: 'name',
  })
  // .populate({
  //   path: 'id_speciality',
  //   select: 'name',
  // })

  next()
})

userSchema.pre('save', async function (next) {
  console.log(this.isModified('password'))
  // Only run this function if password is actually modified
  if (!this.isModified('password')) return next()

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12)

  // Delete the passwordConfirm field
  this.passwordConfirm = undefined
  next()
})

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next()

  this.passwordChangedAt = Date.now() - 1000
  next()
})

// userSchema.pre(/^find/, function (next) {
//   this.find({ active: { $ne: false } })
//   next()
// })

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword)
}

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    )

    return JWTTimestamp < changedTimestamp
  }

  // False means NOT changed
  return false
}

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex')

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000

  return resetToken
}

const User = mongoose.model('User', userSchema)

module.exports = User
