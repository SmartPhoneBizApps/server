const { readData, aggregateCount } = require("../../modules/config2");
const {
  getInitialValues,
  getDateValues,
  replaceConfig,
} = require("../../modules/config");

const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.dataFilters = asyncHandler(async (req, res, next) => {
  let xObject = {};
  // Read Config File...
  let fn1 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);
  var appconfig = replaceConfig(appconfig, req.user);

  // Initial values
  var ivalue = getInitialValues(
    req.headers.applicationid,
    req.headers.businessrole,
    req.user
  );
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

  if (
    req.headers.applicationid == "OPENSAP" ||
    req.headers.applicationid == "EXTLEARN"
  ) {
    // JSON Data
  } else {
    // mongoDB Data
    // Collect the keys
    let filter = config1["Controls"]["filterFields"]["header"];
    filterVal = {};
    filterData = [];
    for (let x = 0; x < filter.length; x++) {
      aggCount = await aggregateCount(
        req,
        filter[x],
        "Descending",
        config1,
        ivalue
      );
      filterVal[filter[x]] = aggCount;
    }
    console.log(filterVal);
  }

  res.status(200).json({
    success: true,
    data2: xObject,
    data: filterVal,
  });
});
