const mongoose = require('mongoose')

async function connect() {
  try {
    await mongoose.connect(
      'mongodb://huuluantvka3:Huuluan123@cluster0-shard-00-00.t8jt1.mongodb.net:27017,cluster0-shard-00-01.t8jt1.mongodb.net:27017,cluster0-shard-00-02.t8jt1.mongodb.net:27017/quanlydoan?ssl=true&replicaSet=atlas-vhqse0-shard-0&authSource=admin&retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    )
    console.log('connected')
  } catch (error) {
    console.log('connect fail')
  }
}

module.exports = { connect }

/**
 * local : mongodb://localhost:27017/project_manager
 * atlas : mongodb://huuluantvka3:Huuluan123@cluster0-shard-00-00.t8jt1.mongodb.net:27017,cluster0-shard-00-01.t8jt1.mongodb.net:27017,cluster0-shard-00-02.t8jt1.mongodb.net:27017/quanlydoan?ssl=true&replicaSet=atlas-vhqse0-shard-0&authSource=admin&retryWrites=true&w=majority
 */
