const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const User = require("../../models/access/User");
const Role = require("../../models/appSetup/Role");

// @desc      Get all users
// @route     GET /api/v1/auth/users
// @access    Private/Admin
exports.getUsers = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      Get single user
// @route     GET /api/v1/auth/users/:id
// @access    Private/Admin
exports.getUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Create user
// @route     POST /api/v1/auth/users
// @access    Private/Admin
exports.createUser = asyncHandler(async (req, res, next) => {
  const user = await User.create(req.body);
  res.status(201).json({
    success: true,
    data: user,
  });
});

// @desc      Update user
// @route     PUT /api/v1/auth/users/:id
// @access    Private/Admin
exports.updateUser = asyncHandler(async (req, res, next) => {
  if (req.body.businessRoles.length > 0) {
    let roleTemp = {
      role: "",
      roleId: "",
    };
    roleArray = [];
    for (i = 0; i < req.body.businessRoles.length; i++) {
      roleTemp.role = req.body.businessRoles[i];
      const roleX = await Role.findOne({ role: req.body.businessRoles[i] });
      roleTemp.roleId = roleX.id;
      req.body.businessRoles[i] = roleTemp;
      roleArray.push(roleTemp);
      roleTemp = {};
    }
    req.body.businessRoles = roleArray;
  }
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Delete user
// @route     DELETE /api/v1/auth/users/:id
// @access    Private/Admin
exports.deleteUser = asyncHandler(async (req, res, next) => {
  await User.findByIdAndDelete({ email: req.params.id });
  res.status(200).json({
    success: true,
    data: {},
  });
});
