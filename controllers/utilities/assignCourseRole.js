const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { getNewConfig } = require("../../modules/config");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.assignCourseRole = asyncHandler(async (req, res, next) => {
  res.status(201).json({
    success: true,
    message: "Course assigned to all users for the Role",
  });
});
