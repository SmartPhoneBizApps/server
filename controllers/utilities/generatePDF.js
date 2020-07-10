const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { generatePdfCertificate } = require("../../modules/config2");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.generatePDF = asyncHandler(async (req, res, next) => {
  var passData = {};
  // passData = { ...req.body };
  passData["ID"] = req.query.ID;

  if (req.query["ReferenceID"]) {
    passData["Title"] =
      req.query["Title"] + " (" + req.query["ReferenceID"] + ")";
  } else {
    passData["Title"] = req.query.Title;
  }
  passData["score"] = req.query.TestScore;
  passData["generatedDate"] = new Date();
  passData["fullName"] = req.user.name;
  passData["req"] = req;
  passData["res"] = res;

  await generatePdfCertificate(passData);
});
