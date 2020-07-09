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
exports.calendarData = asyncHandler(async (req, res, next) => {
  const application = await findOneApp(req.params.id);
  console.log(req.params.id);
  let fn1 =
    "../../NewConfig/" +
    req.params.id +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);
  /// Possible values..
  pvconfig1 = getPVConfig(req.params.id, req.headers.businessrole);
  qPV = getPVQuery(req.params.id, req.headers.businessrole, pvconfig1);
  let resPV = await qPV;

  if (req.params.id == "OPENSAP" || req.params.id == "EXTLEARN") {
  } else {
    // Get Table Schema
    let path = "../../models/smartApp/" + req.params.id;
    const model = require(path);

    // Get total Count
    let query_c = getTotalCount(req.params.id, req, config1);
    let rec = await query_c;
    const count = rec.length;

    let query = readData(req.params.id, req, config1);
    let results = await query;

    console.log(count);
    console.log(results);
  }

  let fn = "../../cards/calendarCard/TRAIN008_EmployeeLearn_new.json";
  var res1 = require(fn);

  res.status(200).json({
    success: true,
    data: res1,
  });
});
