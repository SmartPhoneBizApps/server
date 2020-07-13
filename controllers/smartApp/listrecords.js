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
// @desc      Get all records
// @route     GET /api/v1/listrecords
// @access    Private
exports.getListrecords1 = asyncHandler(async (req, res, next) => {
  /// Application Details..
  const application = await findOneApp(req.params.id);
  let fn1 =
    "../../NewConfig/" +
    req.params.id +
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

  /// Initial values..
  var ivalue = getInitialValues(
    req.params.id,
    req.headers.businessrole,
    req.user
  );
  let ival_out = [];
  let ival = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }

  //// Data Source is JSON Data
  if (req.params.id == "OPENSAP" || req.params.id == "EXTLEARN") {
    outData = {};
    // Read JSON source file
    let results = [];

    let results1 = [];
    let res1 = {};

    let fn = "../../NewConfig/openSAP_courses.json";
    res1 = require(fn);
    results1 = res1["courses"];

    let t_image = [];
    tCount = 0;

    for (let i1 = 0; i1 < results1.length; i1++) {
      let results2 = {};
      tCount = tCount + 1;
      t_image = [];
      results2["cardImage"] = application["photo"];
      results2["ReferenceID"] = results1[i1].id;
      results2["Group"] = "ExternalCatalog";
      results2["SubGroup"] = "OpenSAP";
      t_image.push(results1[i1]["image"]);
      results2["image"] = t_image;
      t_image = [];
      if (req.headers.mode == "Web" || req.headers.mode == "web") {
        if (config1["Controls"]["USP"] == "UserProfile") {
          results2["USP_Name"] = "OpenSAP course catalog";
          results2["USP_Role"] = "copyright - SAP®";
          //   results[i1].USP_Image =
          //     "https://fierce-oasis-51455.herokuapp.com/logos/logo_opensap.png";
          results2["USP_Image"] = process.env.APPURL + "logos/logo_opensap.png";
        }
      }

      results.push(results2);
    }

    const limit = parseInt(req.query.limit, 10) || 100;
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    // Pagination result
    const pagination = {};
    if (endIndex < tCount) {
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
      oResult.push(results[q]);
    }

    outData["success"] = true;
    outData["count"] = tCount;
    outData["pagination"] = pagination;
    outData["data"] = oResult;
    outData["config"] = config1;

    if (req.headers.mode == "Web" || req.headers.mode == "web") {
      res.status(200).json({
        outData,
        possibleValues: resPV,
        defaultValues: ival_out,
      });
    } else {
      res.status(200).json({
        outData,
      });
    }
  } else {
    //// Data Source is mongoDB....

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
    // Get total Count
    let query_c = getTotalCount(req.params.id, req, config1);
    let rec = await query_c;
    const count = rec.length;

    let query = readData(req.params.id, req, config1);
    let results = await query;

    // If Items are present...
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
        if (req.headers.mode !== "BOTList") {
          results[i1]["ItemData"] = results2;
        }

        results[i1].cardImage = application["photo"];
        if (req.headers.mode == "Web" || req.headers.mode == "web") {
          if (config1["Controls"]["USP"] == "UserProfile") {
            results[i1].USP_Name = "Atul Gupta";
            results[i1].USP_Role = req.headers.businessrole;
            results[i1].USP_Image =
              "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
          }
        }
      }
      // If Items are NOT present...
    } else {
      for (let i1 = 0; i1 < results.length; i1++) {
        results[i1].cardImage = application["photo"];
        if (req.headers.mode == "Web" || req.headers.mode == "web") {
          if (config1["Controls"]["USP"] == "UserProfile") {
            results[i1].USP_Name = "Atul Gupta";
            results[i1].USP_Role = req.headers.businessrole;
            results[i1].USP_Image =
              "https://www.espncricinfo.com/inline/content/image/1183835.html?alt=1";
          }
        }
      }
    }
    /////////////////////////////////////////////////////////////////
    const limit = parseInt(req.query.limit, 10) || 50;
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

    out = {};
    outData = {};

    outData["success"] = true;
    outData["count"] = results.length;
    outData["pagination"] = pagination;
    outData["data"] = results;
    outData["config"] = config1;

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
  }
});
