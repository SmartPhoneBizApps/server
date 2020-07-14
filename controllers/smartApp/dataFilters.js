const { findOneAppDatabyid } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
} = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
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

  /// Possible values..
  pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  qPV = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvconfig1
  );
  let resPV = await qPV;

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

    let filter = config1["Controls"]["dataFilter"];
    let tableFields = config1["Controls"]["filterFieldSource"];

    for (let x = 0; x < filter.length; x++) {
      stat["field"] = filter[x]["field"];
      // Possible Values
      for (let a = 0; a < resPV.length; a++) {
        if (filter[x]["field"] == resPV[a]["PossibleValues"]) {
          stat["key"] = resPV[a]["Value"];
          stat["value"] = resPV[a]["Description"];
          stat["count"] = 0;
          tableOut.push({ ...stat });
        }
      }
      // Table Fields
    }

    for (let y = 0; y < results.length; y++) {
      for (let k = 0; k < tableOut.length; k++) {
        if (results[y][tableOut[k]["field"]] == tableOut[k]["value"]) {
          tableOut[k]["count"] = tableOut[k]["count"] + 1;
        }
      }
    }

    let data = {};
    let nTable = [];
    var set1 = new Set();
    let nTab = [];

    for (let m = 0; m < tableOut.length; m++) {
      if (tableOut[m]["count"] > 0) {
        nTable.push({ ...tableOut[m] });
        set1.add(tableOut[m]["field"]);
      }
    }
    set1.add("GoalsArea");

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

    // vl1["key"] = "Leadership";
    // vl1["value"] = "Leadership";
    // vl1["count"] = 1;
    // nTab.push(vl1);
    // xObject["GoalsArea"] = nTab;

    console.log("DataOut", xObject);
  }

  data = {
    Status: [
      {
        val: "Submitted",
        key: "Submitted",
        count: 2,
      },
      {
        val: "new",
        key: "new",
        count: 1,
      },
    ],

    // FirstName: [
    //   {
    //     val: "Amit",
    //     key: "Amit",
    //     count: 2,
    //   },
    //   {
    //     val: "Atul",
    //     key: "Atul",
    //     count: 10,
    //   },
    // ],
  };

  res.status(200).json({
    success: true,
    data: xObject,
  });
});
