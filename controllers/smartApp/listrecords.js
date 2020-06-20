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

exports.getListrecords1 = asyncHandler(async (req, res, next) => {
  //app = req.params.id;
  const application = await findOneApp(req.params.id);
  // Read New Config File
  let fn =
    "../../NewConfig/" +
    req.params.id +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn);

  // Get Table Schema

  let path = "../../models/smartApp/" + req.params.id;
  const model = require(path);

  if (config1["itemData"] == "Yes") {
    app2 = req.params.id + "_Itm";
    let path2 = "../../models/smartApp/" + app2;
    model2 = require(path2);
  } else {
    model2 = model;
  }

  let query_c = getTotalCount(req.params.id, req, config1);
  let rec = await query_c;
  const count = rec.length;

  let query = readData(req.params.id, req, config1);
  let results = await query;

  rag = [];

  /////////////////////////////////////////////////////////////////
  if (model2 !== model) {
    // Create query string (Item)
    for (let i1 = 0; i1 < results.length; i1++) {
      let results2 = [];
      reqQuery2["ID"] = results[i1]["ID"];
      let queryStr2 = JSON.stringify(reqQuery2);
      console.log(reqQuery2);
      // let queryStr2 = reqQuery2;
      // Create operators ($gt, $gte, etc)
      queryStr2 = queryStr2.replace(
        /\b(gt|gte|lt|lte|in|ne)\b/g,
        (match) => `$${match}`
      );
      query2 = model2.find(JSON.parse(queryStr2));
      results2 = await query2;
      results[i1].cardImage = application["photo"];
      if (req.headers.mode !== "BOTList") {
        results[i1]["ItemData"] = results2;
      }
    }
  } else {
    for (let i1 = 0; i1 < results.length; i1++) {
      results[i1].cardImage = application["photo"];
      if (req.headers.mode == "Web" || req.headers.mode == "web") {
        if (config["Controls"]["USP"] == "UserProfile") {
          results[i1].USP_Name = "Atul Gupta";
          results[i1].USP_Role = req.headers.businessrole;
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
  let config = nConfig(req.params.id, req, config1);
  var ivalue = getInitialValues(
    req.params.id,
    req.headers.businessrole,
    req.user
  );
  ival_out = [];
  ival = {};

  out = {};
  outData = {};

  outData["success"] = true;
  outData["count"] = results.length;
  outData["pagination"] = pagination;
  outData["data"] = results;
  outData["config"] = config1;

  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
    console.log(ival_out);
  }

  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  qPV = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvconfig1
  );

  let resPV = await qPV;
  if (req.headers.mode == "BOTList") {
    buttonData = getButtonData(
      resPV,
      req.headers.applicationid,
      req.headers.businessrole
    );
  }
  if (req.headers.mode == "BOTList") {
    res.status(200).json({
      outData,
      buttons: buttonData,
      defaultValues: ival_out,
    });
  }
  if (req.headers.mode == "BOTDetail") {
    res.status(200).json({
      outData,
      defaultValues: ival_out,
    });
  }
  if (req.headers.mode == "Web" || req.headers.mode == "web") {
    res.status(200).json({
      outData,
      possibleValues: resPV,
      defaultValues: ival_out,
    });
  }

  /*   possibleValues = [];
  defaultValues = [];

  out["outData"] = outData;
  out["possibleValues"] = possibleValues;
  out["defaultValues"] = defaultValues;
  res.status(200).json(out); */

  /*   res.status(200).json({
    success: true,
    count: results.length,
    pagination,
    data: results,
    config: config1,
  }); */
});
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getListrecords = asyncHandler(async (req, res, next) => {
  console.log("IP:", req.ip);
  console.log("HostName:", req.hostname);
  console.log("BaseURL:", req.baseUrl);
  console.log("Path:", req.path);
  console.log("Secure:", req.secure);
  let outData = res.advancedDataList;
  // Initial Values..
  //console.log(req.user);

  //console.log("Status", req.user.hasOwnProperty(["userSettings"]));
  var ivalue = getInitialValues(
    req.headers.applicationid,
    req.headers.businessrole,
    req.user
  );
  ival_out = [];
  ival = {};

  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
    console.log(ival_out);
  }
  // Add ID field in the Item Query... (Only for Items)
  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  query = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvconfig1
  );
  let results = await query;
  if (req.headers.mode == "BOTList") {
    buttonData = getButtonData(
      results,
      req.headers.applicationid,
      req.headers.businessrole
    );
  }
  if (req.headers.mode == "BOTList") {
    res.status(200).json({
      outData,
      buttons: buttonData,
      defaultValues: ival_out,
    });
  }
  if (req.headers.mode == "BOTDetail") {
    res.status(200).json({
      outData,
      defaultValues: ival_out,
    });
  }
  if (req.headers.mode == "Web" || req.headers.mode == "web") {
    res.status(200).json({
      outData,
      possibleValues: results,
      defaultValues: ival_out,
    });
  }
  if (!req.headers.mode) {
    res.status(200).json({
      outData,
      possibleValues: results,
      defaultValues: ival_out,
    });
  }
});
