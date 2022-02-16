exports.upLoad = (req, res, next) => {
  if (!req.file) {
    next(new Error('No file uploaded!'))
    return
  }
  console.log(req.file.path)
  res.json({
    success: true,
    secure_url: req.file.path,
  })
}
