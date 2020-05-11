const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");

// @desc      Create socialmedia
// @route     GET /api/v1/auth/socialmedias
// @access    Private/Admin
exports.checkSocialmedia = asyncHandler(async (req, res, next) => {
  var base64data = req.params.socialmedia;
  newSmedia = base64data.substring(9);
  let buff1 = new Buffer(newSmedia, "base64");
  let SMediaAccountID = buff1.toString("ascii");
  console.log(SMediaAccountID);

  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: SMediaAccountID,
  });

  if (!smedia) {
    return next(new ErrorResponse(`CREATE_SOCIALMEDIA`), 405);
  }

  outdata = {};

  if (smedia.accessToken) {
    outdata["SocialMediaAccountID"] = SMediaAccountID;
    outdata["email"] = smedia.email;
    outdata["SocialMediaType"] = smedia.SocialMediaType;
    outdata["businessRoleName"] = smedia.businessRoleName;
    outdata["token"] = smedia.accessToken;
    // outdata["name"] = req.user.name;
  } else {
    return next(new ErrorResponse(`USER_LOGIN`), 404);
  }

  res.status(201).json({
    success: true,
    data: outdata,
  });
});
