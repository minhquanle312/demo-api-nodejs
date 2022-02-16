const crypto = require('crypto')
const { promisify } = require('util')
const jwt = require('jsonwebtoken')
const User = require('../models/userModel')
const catchAsync = require('../utils/catchAsync')
const AppError = require('../utils/appError')
const sendEmail = require('../utils/email')

// eslint-disable-next-line arrow-body-style
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  })
}
const initAdminAccount = () => {
  return new Promise((resolve, reject) => {
    User.create({
      name: 'Quản trị viên',
      code: '0000',
      email: process.env.EMAIL_ADMIN,
      role: 3,
      gender: 1,
      password: process.env.PASSWORD_ADMIN,
      passwordConfirm: process.env.PASSWORD_ADMIN,
    })
      .then((newUser) => {
        resolve(newUser)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id)
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  }
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true

  res.cookie('jwt', token, cookieOptions)

  user.password = undefined

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  })
}

exports.signup = catchAsync(async (req, res, next) => {
  // WARNING: THIS CODE IS NOT COMPLETELY RIGHT BUT GOOD FOR DEVELOPE
  const newUser = await User.create(req.body)
  // WARNING:THIS CODE BELOW IS RIGHT FOR THE FINAL
  // const newUser = await User.create({
  //   name: req.body.name,
  //   email: req.body.email,
  //   password: req.body.password,
  //   passwordConfirm: req.body.passwordConfirm,
  // })
  createSendToken(newUser, 201, res)
})

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body
  //Trường hợp này lấy tk admin(quyền cao nhất ra, không cần check tk mật khẩu gì cả)
  if (
    email == process.env.EMAIL_ADMIN &&
    password == process.env.PASSWORD_ADMIN
  ) {
    let user = await User.findOne({ email })
    if (!user)
      initAdminAccount()
        .then((newUser) => createSendToken(newUser, 201, res))
        .catch((err) => {
          next(new AppError('Error!', 400))
        })
    else createSendToken(user, 201, res)
  } else {
    // 1) Check if email and password exist
    if (!email || !password) {
      return next(new AppError('Please provide email and password!', 400))
    }

    // 2) Check if user exist && password is correct
    const user = await User.findOne({ email }).select('+password')

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('Incorrect email or password', 401))
    }

    // 3) If everything ok, send token to client
    createSendToken(user, 200, res)
  }
})

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check its
  let token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1]
  }

  // console.log(token)
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    )
  }
  // 2) Verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET)

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id)
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    )
  }

  // 4) Check if the user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please login again', 401)
    )
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser
  next()
})

// eslint-disable-next-line arrow-body-style
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide'].role = 'user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      )
    }

    next()
  }
}

exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POST email
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return next(new AppError('There is no user with this email address', 404))
  }

  // 2) Generate random reset token
  const resetToken = user.createPasswordResetToken()
  await user.save({ validateBeforeSave: false })

  // 3) Send it to user email
  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/user/reset-password/${resetToken}`

  const message = `Forgot your password? Submit a PATCH reqquest with your new password and passwordConfirm to ${resetURL}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (limit for 10 minutes)',
      message,
    })

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email',
    })
  } catch (err) {
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save({ validateBeforeSave: false })

    return next(
      new AppError('There was an error sending the email. Try again later', 500)
    )
  }
})

exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex')

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  })
  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expires', 400))
  }

  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  user.passwordResetToken = undefined
  user.passwordResetExpires = undefined
  await user.save()

  // 3) Update changedPasswordAt property for the user (did that in model, this is middleware)

  // 4) Log the user in, send JWT
  createSendToken(user, 200, res)
})

exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.params.id).select('+password')
  // 2) Check if POSTED current password is correct
  //Ở đây sẽ chia ra làm 2 TH : TH đầu là sv,gv vào thay đổi mk của mình sẽ cần đến current password,
  //TH2 : Admin bấm reset password sẽ không cần biết password cũ mà vẫn có thể thay đổi password
  if (
    req.body.role < 3 &&
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(new AppError('Your password is incorrect', 401))
  }

  // 3) If so, update password
  user.password = req.body.password
  user.passwordConfirm = req.body.passwordConfirm
  await user.save()
  // 4) Log user in, send JWT
  createSendToken(user, 200, res)
})
exports.checkSignin = catchAsync(async (req, res, next) => {
  res.status(200).json({ success: true, result: req.user })
})
