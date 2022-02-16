const mongoose = require('mongoose')

const termSchema = new mongoose.Schema(
  {
    start: {
      type: Number,
      required: [true, 'Term must have start year'],
      min: 1000,
      max: 9999,
    },
    end: {
      type: Number,
      required: [true, 'Term must have end year'],
      min: 1000,
      max: 9999,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

const Term = mongoose.model('Term', termSchema)

module.exports = Term
