const crypto = require("crypto");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const sendEmail = require("../../utils/sendEmail");
const sendEmail1 = require("../../utils/sendEmailProd");
const User = require("../../models/access/User");
const Role = require("../../models/appSetup/Role");
const Socialmedia = require("../../models/access/Socialmedia");
const Agent = require("../../models/access/Agent");
const { createUser } = require("../../modules/config");
const { valAlreadyReg } = require("../../modules/validationMessages");
// @desc      Register user(PIN)
// @route     POST /api/v1/auth/register
// @access    Public
exports.register = asyncHandler(async (req, res, next) => {
  businessRoles = [];
  busRole = {};
  if (req.body.agent) {
    let agent = await Agent.findOne({ agent: req.body.agent });
    req.body.company = agent.company;
    req.body.branch = agent.branch;
    req.body.area = agent.area;
  }
  if (req.body.businessRole) {
    let role1 = await Role.findOne({ role: req.body.businessRole });
    if (role1) {
      busRole["role"] = req.body.businessRole;
      busRole["roleId"] = role1.id;
      busRole["roleId"] = role1.id;
      businessRoles.push(busRole);
      req.body.businessRoles = businessRoles;
    }
    if (req.body.regQuestion) {
      const k1 = "Role_" + req.body.businessRole;
      req.body[k1] = req.body.regQuestion;
    }
  }
  let user = await User.findOne({ email: req.body.email });
  if (!user) {
    user = await createUser(req.body);
  } else {
    msg = valAlreadyReg(req.body.email);
    return next(new ErrorResponse(msg, 404));
  }
  sendPINTokenResponse(user, 200, res);
});
// @desc      Register user (Password)
// @route     POST /api/v1/auth/register
// @access    Public
exports.register2 = asyncHandler(async (req, res, next) => {
  const {
    name,
    email,
    password,
    role,
    userType,
    userAccess,
    company,
  } = req.body;
  // Validate userType and
  if (userType === "") {
    return next(
      new ErrorResponse("Please specify User Type (internal or external)", 400)
    );
  }
  if (userType === "internal") {
    if (!userAccess) {
      return next(
        new ErrorResponse(
          "Please provide Access Level: company, area, branch, area_branch",
          400
        )
      );
    }
  }
  if (userAccess === "company") {
    if (!company) {
      return next(
        new ErrorResponse("Please specify company for internal users", 400)
      );
    }
  }
  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
  });
  sendTokenResponse(user, 200, res);
});
// @desc      Delete user
// @route     DELETE /api/v1/courses/:id
// @access    Private
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findOneAndDelete({ email: req.params.email });
  res.status(200).json({
    success: true,
    data: "User Removed",
  });
});

// @desc      Login user
// @route     POST /api/v1/auth/login
// @access    Public
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;
  // Validate emil & password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  // Check if password matches
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});
// @desc      Log user out / clear cookie
// @route     GET /api/v1/auth/logout
// @access    Private
exports.logout = asyncHandler(async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    data: {},
  });
});
// @desc      Get current logged in user
// @route     POST /api/v1/auth/me
// @access    Private
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});
// @desc      Update user details
// @route     PUT /api/v1/auth/updatearea
// @access    Private
exports.updateArea = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    area: req.body.area,
  };
  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });
  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(200).json({
    success: true,
    user: user2,
  });
});
// @desc      Update user details
// @route     PUT /api/v1/auth/updatebranch
// @access    Private
exports.updateBranch = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    branch: req.body.branch,
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true,
  });

  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(200).json({
    success: true,
    user: user2,
  });
});
// @desc      Update user details
// @route     PUT /api/v1/auth/updatedetails
// @access    Private
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email,
  };

  const user = await User.findOneAndUpdate(
    { email: req.body.email },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(200).json({
    success: true,
    user: user2,
  });
});

// @desc      Update password
// @route     PUT /api/v1/auth/updatepassword
// @access    Private
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Password is incorrect", 401));
  }
  user.password = req.body.newPassword;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// @desc      Forgot password
// @route     POST /api/v1/auth/forgotpassword
// @access    Public
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(200).json({
    success: true,
    user: user2,
  });
});

// @desc      Reset password
// @route     PUT /api/v1/auth/resetpassword/:resettoken
// @access    Public
exports.resetPassword = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  // Set new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user: user2,
  });
};

// Get token from model, create cookie and send response
const sendPINTokenResponse = asyncHandler(async (user, statusCode, res) => {
  // Get reset token
  UserPIN = Math.floor(100000 + Math.random() * 900000);
  user.UserPIN = UserPIN;
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 10 * 60 * 1000
    ),
    httpOnly: true,
  };
  const resetToken = user.getResetPasswordToken();
  nToken = crypto.createHash("sha256").update(resetToken).digest("hex");
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  const message = `Your PIN number is: ${UserPIN} , you are receiving this email because you (or someone else) is performing login to SmartApp`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    user.resetPasswordToken = nToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({
      success: true,
      data: "Email sent",
      //   resetURL: resetUrl,
      resetToken: resetToken,
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      success: false,
      error: "Email could not be sent",
    });
  }
  res.status(200).cookie("resetToken", resetToken, options).json({
    success: true,
    UserPIN,
    resetToken,
    //    resetUrl,
    message,
  });
});

// @desc      send an email
// @route     POST /api/v1/auth/sendEmail
// @access    Public
exports.sendEmail = asyncHandler(async (req, res, next) => {
  emailTo = req.body.emailTo;
  Subject = req.body.subject;
  message = req.body.message;
  try {
    await sendEmail1({
      email: emailTo,
      subject: Subject,
      message: message,
    });
    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc      Login Via PIN
// @route     POST /api/v1/auth/pinLogin
// @access    Public
exports.pinLogin = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new ErrorResponse("There is no user with that email", 404));
  }
  // Get reset token
  UserPIN = Math.floor(100000 + Math.random() * 900000);
  user.UserPIN = UserPIN;
  const resetToken = user.getResetPasswordToken();
  await user.save({ validateBeforeSave: false });
  let resetUrl = "";
  // Create reset url
  if (req.body.mode === "bot") {
    resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/checkbotpin/${resetToken}`;
  } else {
    resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/checkpin/${resetToken}`;
  }
  const message = `Your PIN number is: ${UserPIN} , you are receiving this email because you (or someone else) is performing login to SmartApp`;
  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message,
    });
    res.status(200).json({
      success: true,
      data: "Email sent",
      resetURL: resetUrl,
      resetToken: resetToken,
      body: req.body,
    });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });
    return next(new ErrorResponse("Email could not be sent", 500));
  }
});

// @desc      Validate PIN
// @route     PUT /api/v1/auth/checkpin/:resettoken
// @access    Public
exports.checkPin = asyncHandler(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  if (user.UserPIN != req.body.pin) {
    return next(new ErrorResponse("Invalid PIN", 400));
  }
  sendTokenResponse(user, 200, res);
});
// @desc      Validate PIN
// @route     PUT /api/v1/auth/checkpin/:resettoken
// @access    Public
exports.checkBotPin = asyncHandler(async (req, res, next) => {
  var base64data = req.body.SocialMediaAccountID;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new ErrorResponse("Invalid token", 400));
  }
  if (user.UserPIN != req.body.pin) {
    return next(new ErrorResponse("Invalid PIN", 400));
  }
  //sendTokenResponse(user, 200, res);
  // Atul added on 11/05
  // Create token
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  let sm = await Socialmedia.find(
    {
      email: user.email,
      SocialMediaAccountID: SMediaAccountID,
    },
    { _id: 0 }
  );
  const filter = {
    email: user.email,
    SocialMediaAccountID: SMediaAccountID,
  };
  const update = { accessToken: token };

  let skg = await Socialmedia.findOneAndUpdate(filter, update, {
    returnOriginal: false,
  });
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();
  user2 = user;
  user2.UserPIN = "XXXXX";
  user2.password = "XXXXX";
  res.status(200).cookie("token", token, options).json({
    success: true,
    token,
    user: user2,
  });
});
