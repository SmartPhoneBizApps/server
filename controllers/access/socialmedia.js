const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Socialmedia = require("../../models/access/Socialmedia");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/access/User");

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
  const busRole = await Role.findOne({ role: req.body.businessRoleName });
  const user = await User.findOne({ email: req.body.email });
  req.body.user = user.id;
  req.body.businessRole = busRole.id;
  console.log(req.body);
  const socialmedia = await Socialmedia.create(req.body);
  res.status(201).json({
    success: true,
    data: socialmedia,
  });
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
  await Socialmedia.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    data: {},
  });
});
