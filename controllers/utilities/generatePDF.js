const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { generatePdfCertificate } = require("../../modules/config2");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.generatePDF = asyncHandler(async (req, res, next) => {
  var passData = {};
  passData = { ...req.body };
  passData["req"] = req;
  passData["res"] = res;
  //   passData["fullName"] = "Divyesh Trambadia";
  //   passData["score"] = "65";
  //   passData["generatedDate"] = "July 8,2020";
  //   passData["fileName"] = "divyeshcertificate";
  //   passData["courseName"] = "SAPUI5";
  //   passData["req"] = req;
  //   passData["res"] = res;

  cert = await generatePdfCertificate(passData);
  pth = process.env.APPURL + "certificates/" + req.body["fileName"] + ".pdf";

  res.status(201).json({
    success: true,
    message: "Certificated created",
    file: pth,
  });
});
