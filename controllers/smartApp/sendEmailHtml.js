const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.sendEmailHtml = asyncHandler(async (req, res, next) => {
  let fn = "../../NewConfig/emailTemplate.json";
  var res1 = require(fn);
  var passData = res1["AssignTraining"];
  passData["userName"] = "Divyesh";
  passData["imageURL"] =
    process.env.APPURL + res1["AssignTraining"]["emailImage"];
  passData["buttonLink"] = "https://www.google.com";
  passData["req"] = req;
  passData["res"] = res;
  console.log(passData);
  await sendHtmlEmail(passData);
});
