const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
} = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.appointmentsGet = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    success: true,
    data: person1,
  });
});
