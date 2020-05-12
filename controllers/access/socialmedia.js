const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/access/User");
const sendEmail = require("../../utils/sendEmail");

// @desc      Get all socialmedias
// @route     GET /api/v1/auth/socialmedias
// @access    Private/Admin
exports.getSocialmedias = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single socialmedia
// @route     GET /api/v1/auth/socialmedias/:id
// @access    Private/Admin
exports.getSocialmedia = asyncHandler(async (req, res, next) => {
  const socialmedia = await Socialmedia.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: socialmedia,
  });
});

// @desc      Create socialmedia
// @route     POST /api/v1/auth/socialmedias
// @access    Private/Admin
exports.createSocialmedia = asyncHandler(async (req, res, next) => {
  // Get hashed token
  var base64data = req.body.SocialMediaAccountID;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  sm = { ...req.body };

  sm["SocialMediaAccountID"] = SMediaAccountID;
  console.log(sm["SocialMediaAccountID"]);
  console.log(req.body.email);
  const busRole = await Role.findOne({ role: req.body.businessRoleName });
  if (!busRole) {
    return next(new ErrorResponse(`NO_ROLE`), 405);
  }

  // req.body.user = user.id;
  sm.businessRole = busRole.id;
  console.log(req.body);
  const socialmedia = await Socialmedia.create(sm);

  const user = await User.findOne({ email: req.body.email });
  userRegistered = "USER_NOT_REGISTERED";
  regQuestion = {};
  userAccount = "";

  if (user) {
    // user already exist
    userAccount = "USER_CREATED";
    if (user[req.body.businessRoleName]) {
      userRegistered = "USER_REGISTERED";
      regQuestion = user[req.body.businessRoleName];
    }
    // Get reset token
    UserPIN = Math.floor(100000 + Math.random() * 900000);
    user.UserPIN = UserPIN;
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    let resetUrl = "";
    resetUrl = `${req.protocol}://${req.get(
      "host"
    )}/api/v1/auth/checkbotpin/${resetToken}`;
    const message = `Your PIN number is: ${UserPIN} , you are receiving this email because you (or someone else) is performing login to SmartApp`;
    try {
      await sendEmail({
        email: user.email,
        subject: "Social Media reset token",
        message,
      });
      res.status(200).json({
        success: true,
        data: socialmedia,
        resetURL: resetUrl,
        resetToken: resetToken,
        userAccount: userAccount,
        userRegistered: userRegistered,
        regQuestion: regQuestion,
        email: "EMAIL_SENT_USER",
        body: req.body,
      });
    } catch (err) {
      console.log(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse("Email could not be sent", 500));
    }
  } else {
    userAccount = "USER_NOT_CREATED";
    userRegistered = "USER_NOT_REGISTERED";
    res.status(201).json({
      success: true,
      data: socialmedia,
      userAccount: userAccount,
      userRegistered: userRegistered,
      email: "EMAIL_NOT_SENT_USER",

      body: req.body,
    });
  }

  /////////
});

// @desc      Update socialmedia
// @route     PUT /api/v1/auth/socialmedias/:id
// @access    Private/Admin
exports.updateSocialmedia = asyncHandler(async (req, res, next) => {
  console.log(req.params);

  const socialmedia = await Socialmedia.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).json({
    success: true,
    data: socialmedia,
  });
});

// @desc      Delete socialmedia
// @route     DELETE /api/v1/auth/socialmedias/:id
// @access    Private/Admin
exports.deleteSocialmedia = asyncHandler(async (req, res, next) => {
  var base64data = req.params.id;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");

  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: SMediaAccountID,
  });

  await Socialmedia.findByIdAndDelete(smedia.id);
  res.status(200).json({
    success: true,
    data: {},
  });
});
