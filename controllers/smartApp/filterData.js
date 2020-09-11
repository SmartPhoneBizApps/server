const asyncHandler = require("../../middleware/async");
const {
  getPVConfig,
  getPVQuery,
  getInitialValues,
  getDateValues,
  findOneApp,
  getNewConfig,
  getPVField,
} = require("../../modules/config");
// @desc      Get all records
// @route     GET /api/v1/listrecords
// @access    Private
exports.filterData = asyncHandler(async (req, res, next) => {
  const applicationId = req.params.app;
  const businessrole = req.params.businessrole;
  var appconfig = getNewConfig(applicationId, businessrole);
  /// Possible values..
  pvappconfig = getPVConfig(applicationId, businessrole);
  qPV = getPVQuery(applicationId, businessrole, pvappconfig);
  let resPV = await qPV;
  /// Possible values for Status..
  sPV = getPVField(applicationId, "Status");
  let statusPV = await sPV;
  // Initial values
  var ivalue = getInitialValues(applicationId, businessrole, req.user);
  let ival_out = [];
  let ival = {};
  let out = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }

  res.status(200).json({
    filterFields: appconfig["Controls"]["filterScFields"],
    config: appconfig,
    possibleValues: resPV,
    defaultValues: ival_out,
    statusValues: statusPV,
    config: appconfig,
  });
});
