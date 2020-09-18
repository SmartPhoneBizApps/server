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
    let query = readData(req.headers.applicationid, req, config1);
    let results = await query;
    let stat = {};
    let tableOut = [];
    let filter = config1["Controls"]["filterFields"]["header"];
    var set = new Set();
    // Collect the keys
    filterVal = {};
    filterData = [];
    for (let x = 0; x < filter.length; x++) {
      aggCount = await aggregateCount(req, filter[x], "Descending", config1);
      filterVal[filter[x]] = aggCount;

      //   filterData.push({ ...filterVal });
      //   filterVal = {};
    }
    console.log(filterData);
    for (let x = 0; x < filter.length; x++) {
      for (let y = 0; y < results.length; y++) {
        if (results[y][filter[x]] !== undefined) {
          set.add(results[y][filter[x]]);
        }
      }
      set.forEach((en1) => {
        stat["field"] = filter[x];
        stat["key"] = en1;
        stat["value"] = en1;
        stat["count"] = 0;
        tableOut.push({ ...stat });
        stat = {};
      });
      set = new Set();
    }
    // Get Header Counts
    for (let y = 0; y < results.length; y++) {
      for (let k = 0; k < tableOut.length; k++) {
        if (results[y][tableOut[k]["field"]] == tableOut[k]["value"]) {
          tableOut[k]["count"] = tableOut[k]["count"] + 1;
        }
      }
    }

    let nTable = [];
    var set1 = new Set();
    let nTab = [];

    for (let m = 0; m < tableOut.length; m++) {
      if (tableOut[m]["count"] > 0) {
        nTable.push({ ...tableOut[m] });
        set1.add(tableOut[m]["field"]);
      }
    }
    set1.forEach((element) => {
      for (let b = 0; b < nTable.length; b++) {
        vl1 = {};
        const el01 = nTable[b];
        if (nTable[b]["field"] == element) {
          vl1["key"] = nTable[b]["key"];
          vl1["value"] = nTable[b]["value"];
          vl1["count"] = nTable[b]["count"];
          nTab.push({ ...vl1 });
          vl1 = {};
        }
      }
      xObject[element] = nTab;
      nTab = [];
    });
  }

  res.status(200).json({
    success: true,
    data2: xObject,
    data: filterVal,
  });
});
