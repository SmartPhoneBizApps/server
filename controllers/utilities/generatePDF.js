const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { generatePdfCertificate } = require("../../modules/config2");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.generatePDF = asyncHandler(async (req, res, next) => {
  var passData = {};
  // passData = { ...req.body };

  passData["ID"] = req.body.ID;
  if (req.body["ReferenceID"]) {
    passData["Title"] =
      req.body["Title"] + " (" + req.body["ReferenceID"] + ")";
  } else {
    passData["Title"] = req.body.Title;
  }
  passData["score"] = req.body.TestScore;
  passData["generatedDate"] = new Date();
  passData["fullName"] = req.user.name;
  console.log(req.body.ID);
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
  pth = process.env.APPURL + "certificates/" + req.body["ID"] + ".pdf";
  console.log(req.user.name);
  res.status(201).json({
    success: true,
    message: "Certificated created",
    file: pth,
  });
});
