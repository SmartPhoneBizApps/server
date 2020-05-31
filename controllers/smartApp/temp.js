const asyncHandler = require("../../middleware/async");

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.temp = asyncHandler(async (req, res, next) => {
  mydata = {};
  res.status(200).json({
    success: true,
    data: result,
  });
});
// -----------------------------------------------------
// -----------------------------------------------------
// @desc      Update record
// @route     POST /api/v1/datarecords/
// @access    Private
// -----------------------------------------------------
// -----------------------------------------------------
exports.temp2 = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: result,
  });
});
