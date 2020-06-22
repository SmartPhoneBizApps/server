const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
//const postcode = require("../../models/utilities/postcode.js");
const { getNewConfig, getpostcodeData } = require("../../modules/config");

const request = require("request");
const https = require("https");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)

// var aa = new calfunction();
// console.log(aa.Handler[ADD1()]);
// return false;

exports.dentalCharting = asyncHandler(async (req, res, next) => {
  out = {};
  optData = [];
  out["UL"] = "8L,7L,6L,5L,4L,3L,2L,1L";
  outData.push(out);
  out = {};
  out["UR"] = "1R,2R,3R,4R,5R,6R,7R,8R";
  outData.push(out);
  out = {};
  out["LL"] = "8L,7L,6L,5L,4L,3L,2L,1L";
  outData.push(out);
  out = {};
  out["LR"] = "1R,2R,3R,4R,5R,6R,7R,8R";
  outData.push(out);
  out = {};

  res.status(201).json({
    success: true,
    data: optData,
  });
});
