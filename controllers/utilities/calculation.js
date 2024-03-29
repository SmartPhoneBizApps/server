const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const calfunction = require("../../models/utilities/calfunction.js");
const { getNewConfig } = require("../../modules/config");
// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.getcalculation = asyncHandler(async (req, res, next) => {
  console.log("Function - utilities/getcalculation");
  if (!req.headers.applicationid) {
    return next(new ErrorResponse(`Please provide App ID(Header)`, 400));
  }
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  if (!req.headers.tab) {
    return next(new ErrorResponse(`Please provide Tab`, 400));
  }
  // Read New Config File
  var appconfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  let config = appconfig["CalculatedFields"];
  let outdata = req.body;
  var Handler = new calfunction();

  outdata = Handler["tablecalculation"](outdata, config, req.headers.tab);
  res.status(201).json({
    success: true,
    data: outdata,
  });
});
