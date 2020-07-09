const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.calendarData = asyncHandler(async (req, res, next) => {
  let fn = "../../cards/calendarCard/TRAIN008_EmployeeLearn_new.json";
  var res1 = require(fn);

  res.status(200).json({
    success: true,
    data: res1,
  });
});
