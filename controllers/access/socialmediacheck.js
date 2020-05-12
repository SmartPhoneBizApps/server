const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");
const sendEmail = require("../../utils/sendEmail");
const User = require("../../models/access/User");
// @desc      Create socialmedia
// @route     GET /api/v1/auth/socialmedias
// @access    Private/Admin
exports.checkSocialmedia = asyncHandler(async (req, res, next) => {
  var base64data = req.params.socialmedia;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  outdata = {};
  userRegistered = "USER_NOT_REGISTERED";
  regQuestion = {};
  userAccount = "";

  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: SMediaAccountID,
  });

  if (!smedia) {
    return next(new ErrorResponse(`CREATE_SOCIALMEDIA`), 405);
  } else {
    const user = await User.findOne({ email: smedia.email });
    if (user) {
      userAccount = "USER_CREATED";
      userName = user.name;
      if (user[smedia.businessRoleName]) {
        userRegistered = "USER_REGISTERED";
        regQuestion = user[smedia.businessRoleName];
      } else {
        userRegistered = "USER_NOT_REGISTERED";
        regQuestion = {};
      }
      if (!smedia.accessToken) {
        // Situation User Already created and No access Token
        loginRequired = "USER_LOGIN_REQUIRED";
        accessToken = "";
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
            resetURL: resetUrl,
            resetToken: resetToken,
            userAccount: userAccount,
            userName: userName,
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
        // Situation User Already created and access Token already there..
        loginRequired = "USER_LOGIN_NOT_REQUIRED";
        accessToken = smedia.accessToken;
        res.status(200).json({
          success: true,
          loginRequired: loginRequired,
          accessToken: accessToken,
          userAccount: userAccount,
          userName: userName,
          userRegistered: userRegistered,
          regQuestion: regQuestion,
          email: "EMAIL_NOT_SENT_USER",
          body: req.body,
        });
      }
    } else {
      // Situation User not created ..
      userAccount = "USER_NOT_CREATED";
      userRegistered = "USER_NOT_REGISTERED";
      res.status(200).json({
        success: true,
        userAccount: userAccount,
        userRegistered: userRegistered,
        email: "EMAIL_NOT_SENT_USER",
        body: req.body,
      });
    }
  }
});
