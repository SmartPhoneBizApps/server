const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");
const sendEmail = require("../../utils/sendEmail");
const User = require("../../models/access/User");
const jwt = require("jsonwebtoken");
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
  status = {
    userAccount: "USER_NOT_CREATED",
    userRegistered: "USER_NOT_REGISTERED",
    loginRequired: "USER_LOGIN_REQUIRED",
    emailStatus: "EMAIL_NOT_SENT_USER",
  };
  tokens = {
    accessToken: "",
    resetToken: "",
    resetURL: "",
  };
  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: SMediaAccountID,
  });

  if (!smedia) {
    return next(new ErrorResponse(`CREATE_SOCIALMEDIA`), 405);
  } else {
    data = {
      SocialMediaAccountID: smedia.SocialMediaAccountID,
      email: smedia.email,
      SocialMediaType: smedia.SocialMediaType,
      businessRoleName: smedia.businessRoleName,
      businessRole: smedia.businessRole,
      regQuestion: {},
      userName: "",
    };

    tokens = {
      accessToken: "",
      resetToken: "",
      resetURL: "",
    };

    const user = await User.findOne({ email: smedia.email });
    if (user) {
      status["userAccount"] = "USER_CREATED";
      data["userName"] = user.name;
      const k1 = "Role_" + smedia.businessRoleName;
      if (user[k1]) {
        status["userRegistered"] = "USER_REGISTERED";
        data["regQuestion"] = user[k1];
      } else {
        status["userRegistered"] = "USER_NOT_REGISTERED";
        data["regQuestion"] = {};
      }
      if (
        !smedia.accessToken &&
        status["userRegistered"] !== "USER_NOT_REGISTERED"
      ) {
        // Situation User Already created and No access Token
        status["loginRequired"] = "USER_LOGIN_REQUIRED";
        tokens["accessToken"] = "";
        // Get reset token
        UserPIN = Math.floor(100000 + Math.random() * 900000);
        user.UserPIN = UserPIN;
        const resetToken = user.getResetPasswordToken();
        await user.save({ validateBeforeSave: false });
        let resetUrl = "";
        resetUrl = `${req.protocol}://${req.get(
          "host"
        )}/api/v1/auth/checkbotpin/${resetToken}`;
        tokens["resetURL"] = resetUrl;
        tokens["resetToken"] = resetToken;
        status["emailStatus"] = "EMAIL_SENT_USER";
        const message = `Your PIN number is: ${UserPIN} , you are receiving this email because you (or someone else) is performing login to SmartApp`;
        try {
          await sendEmail({
            email: user.email,
            subject: "Social Media reset token",
            message,
          });
          res.status(200).json({
            success: true,
            data: data,
            tokens: tokens,
            status: status,
          });
        } catch (err) {
          console.log(err);
          user.resetPasswordToken = undefined;
          user.resetPasswordExpire = undefined;
          await user.save({ validateBeforeSave: false });
          return next(new ErrorResponse("Email could not be sent", 500));
        }
      } else if (
        smedia.accessToken &&
        status["userRegistered"] !== "USER_NOT_REGISTERED"
      ) {
        // Situation User Already created and access Token already there..

        // Verify token
        const decoded = jwt.verify(smedia.accessToken, process.env.JWT_SECRET);
        vUser = await User.findById(decoded.id);
        if (vUser != undefined) {
          status["loginRequired"] = "USER_LOGIN_NOT_REQUIRED";
        } else {
          status["loginRequired"] = "USER_LOGIN_REQUIRED";
        }

        tokens["accessToken"] = smedia.accessToken;
        res.status(200).json({
          success: true,
          data: data,
          tokens: tokens,
          status: status,
        });
      } else {
        // Situation User Already created and access Token already there..
        res.status(200).json({
          success: true,
          data: data,
          tokens: tokens,
          status: status,
        });
      }
    } else {
      // Situation User not created ..
      status["userAccount"] = "USER_NOT_CREATED";
      status["userRegistered"] = "USER_NOT_REGISTERED";
      res.status(200).json({
        success: true,
        data: data,
        status: status,
      });
    }
  }
});
