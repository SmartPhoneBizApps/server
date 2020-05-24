const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
const { getNewConfig } = require("../../modules/config");
// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.getaddress = asyncHandler(async (req, res, next) => {
  // Get App from Header
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;
  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID(Header)`, 400));
  }

  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessrole,
  });
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  // Read Card Configuration for the Role (X1)
  /* let fn1 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var appconfig = require(fn1); */

  // Read New Config File
  var appconfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  let config = appconfig["CalculatedFields"];
  let outdata = req.body;
  // Divyesh to add the code here
  // Config contains calculated fields
  // req.body contains the business data
  // update all the calculated fields and set them in outdata
  console.log(config);

  res.status(201).json({
    success: true,
    data: outdata,
    config: config,
    app: req.headers.applicationid,
    role: req.headers.businessrole,
  });
});
