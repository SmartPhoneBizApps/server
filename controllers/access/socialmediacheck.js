const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");

// @desc      Create socialmedia
// @route     GET /api/v1/auth/socialmedias
// @access    Private/Admin
exports.checkSocialmedia = asyncHandler(async (req, res, next) => {
  const smedia = await Socialmedia.findOne({
    SocialMediaAccountID: req.params.socialmedia,
  });
  console.log(req.user);
  console.log(smedia);

  if (smedia) {
    if (smedia.email != req.user.email) {
      return next(
        new ErrorResponse(
          `Social Media ID is not registered for the login user  ${req.body.email}`
        ),
        404
      );
    }
  } else {
    return next(
      new ErrorResponse(
        `Social Media ID for ${req.params.socialmedia} is not setup yet`
      ),
      404
    );
  }

  outdata = {};
  outdata["SocialMediaAccountID"] = smedia.SocialMediaAccountID;
  outdata["email"] = smedia.email;
  outdata["SocialMediaType"] = smedia.SocialMediaType;
  outdata["businessRoleName"] = smedia.businessRoleName;
  outdata["name"] = req.user.name;

  res.status(201).json({
    success: true,
    data: outdata,
  });
});
