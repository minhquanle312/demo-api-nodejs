const User = require('../models/userModel')
const Class = require('../models/classModel')
const Department = require('../models/departmentModel')
const Speciality = require('../models/specialityModel')
const Project = require('../models/projectModel')

exports.getTotal = (req, res, next) => {
  // const totalStudent = User.find({ role: 1 }).then((data) => data.length)
  // const totalTeacher = User.find({ role: 2 }).then((data) => data.length)
  // const totalFailStudent = Project.find({ mark: { $lt: 4 } }).then(
  //   (data) => data.length
  // )
  // const totalPassStudent = Project.find({ mark: { $gte: 4 } }).then(
  //   (data) => data.length
  // )
  const totalStudent = User.countDocuments({ role: 1 })
  const totalTeacher = User.countDocuments({ role: 2 })
  const totalFailStudent = Project.countDocuments({ mark: { $lt: 4 } })
  const totalPassStudent = Project.countDocuments({ mark: { $gte: 4 } })

  // const totalClass = Class.find().then((data) => data.length)
  const totalClass = Class.estimatedDocumentCount()
  // const totalDepartment = Department.find().then((data) => data.length)
  const totalDepartment = Department.estimatedDocumentCount()
  const totalSpeciality = Speciality.estimatedDocumentCount()
  const totalProject = Project.estimatedDocumentCount()
  Promise.all([
    totalStudent,
    totalTeacher,
    totalFailStudent,
    totalPassStudent,
    totalClass,
    totalDepartment,
    totalSpeciality,
    totalProject,
  ]).then((result) =>
    res.status(200).json({
      success: true,
      data: {
        totalStudent: result[0],
        totalTeacher: result[1],
        totalFailStudent: result[2],
        totalPassStudent: result[3],
        totalClass: result[4],
        totalDepartment: result[5],
        totalSpeciality: result[6],
        totalProject: result[7],
      },
    })
  )
}
