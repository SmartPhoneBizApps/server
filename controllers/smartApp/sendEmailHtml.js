const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.sendEmailHtml = asyncHandler(async (req, res, next) => {
  console.log("Test");
  await sendHtmlEmail(req, res);
  //   res.status(200).json({
  //     success: true,
  //   });
});
