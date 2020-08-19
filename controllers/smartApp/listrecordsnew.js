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
const advancedDataList = require("../../middleware/advancedDataList");

exports.listrecordsnew = asyncHandler(async (req, res, next) => {
  const applicationId = req.params.app;
  const businessrole = req.params.businessrole;
  //  const Title = req.params.Title;
  const mode = req.params.mode;

  const application = await findOneApp(applicationId);

  // Read New Config File
  let fn =
    "../../NewConfig/" + applicationId + "_" + businessrole + "_config.json";
  var config1 = require(fn);

  // Get Table Schema

  let path = "../../models/smartApp/" + applicationId;
  const model = require(path);

  if (config1["itemData"] == "Yes") {
    app2 = applicationId + "_Itm";
    let path2 = "../../models/smartApp/" + app2;
    model2 = require(path2);
  } else {
    model2 = model;
  }

  let query_c = getTotalCount(applicationId, req, config1);
  let rec = await query_c;
  const count = rec.length;

  let query = readData(applicationId, req, config1);
  let results = await query;

  /////////////////////////////////////////////////////////////////
  if (model2 !== model) {
    // Create query string (Item)
    for (let i1 = 0; i1 < results.length; i1++) {
      let results2 = [];
      reqQuery2["ID"] = results[i1]["ID"];
      let queryStr2 = JSON.stringify(reqQuery2);
      // let queryStr2 = reqQuery2;
      // Create operators ($gt, $gte, etc)
      queryStr2 = queryStr2.replace(
        /\b(gt|gte|lt|lte|in|ne)\b/g,
        (match) => `$${match}`
      );
      query2 = model2.find(JSON.parse(queryStr2));
      results2 = await query2;
      results[i1].cardImage = application["photo"];
      if (mode !== "BOTList") {
        results[i1]["ItemData"] = results2;
      }
    }
  } else {
    for (let i1 = 0; i1 < results.length; i1++) {
      results[i1].cardImage = application["photo"];
      if (mode == "Web" || mode == "web") {
        if (config1["Controls"]["USP"] == "UserProfile") {
          results[i1].USP_Name = "Atul Gupta";
          results[i1].USP_Role = businessrole;
          results[i1].USP_Image =
            "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
        }
      }
    }
  }

  /////////////////////////////////////////////////////////////////
  const limit = parseInt(req.query.limit, 10) || 25;
  // Pagination
  const page = parseInt(req.query.page, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  // Pagination result
  const pagination = {};
  if (endIndex < count) {
    pagination.next = {
      page: page + 1,
      limit,
    };
  }
  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    };
  }
  oResult = [];
  for (let q = startIndex; q < endIndex; q++) {
    if (results[q] !== undefined) {
      oResult.push(results[q]);
    }
  }
  let config = nConfig(applicationId, req, config1);
  var ivalue = getInitialValues(applicationId, businessrole, req.user);
  ival_out = [];
  ival = {};

  out = {};
  outData = {};

  outData["success"] = true;
  outData["count"] = results.length;
  outData["pagination"] = pagination;
  outData["data"] = oResult;
  outData["config"] = config1;

  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }

  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  pvconfig1 = getPVConfig(applicationId, businessrole);
  qPV = getPVQuery(applicationId, businessrole, pvconfig1);

  let resPV = await qPV;
  if (mode == "BOTList") {
    buttonData = getButtonData(resPV, applicationId, businessrole);
  }
  if (mode == "BOTList") {
    res.status(200).json({
      outData,
      buttons: buttonData,
      defaultValues: ival_out,
    });
  }
  if (mode == "BOTDetail") {
    res.status(200).json({
      outData,
      defaultValues: ival_out,
    });
  }
  if (mode == "Web" || mode == "web") {
    res.status(200).json({
      outData,
      possibleValues: resPV,
      defaultValues: ival_out,
    });
  }
});
