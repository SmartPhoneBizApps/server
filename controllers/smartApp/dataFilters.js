const { aggregateCount } = require("../../modules/config");
const { readData } = require("../../modules/config2");
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
      aggCount = await aggregateCount(req, filter[x], "Descending", config1);
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
