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
  const application = await findOneApp(req.params.id);
  let fn1 =
    "../../NewConfig/" +
    req.params.id +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);

  //// Data Source is JSON Data
  if (req.params.id == "OPENSAP" || req.params.id == "EXTLEARN") {
    pvconfig1 = getPVConfig(
      req.headers.applicationid,
      req.headers.businessrole
    );
    qPV = getPVQuery(
      req.headers.applicationid,
      req.headers.businessrole,
      pvconfig1
    );

    let resPV = await qPV;
    outData = {};

    let fn = "../../NewConfig/openSAP_courses.json";
    var res1 = require(fn);
    results = res1["courses"];

    let t_image = [];
    for (let i1 = 0; i1 < results.length; i1++) {
      t_image = [];
      results[i1].cardImage = application["photo"];
      results[i1].ReferenceID = results[i1].id;
      results[i1].Group = "ExternalCatalog";
      results[i1].SubGroup = "OpenSAP";
      t_image.push(results[i1]["image"]);
      results[i1].image = t_image;
      if (req.headers.mode == "Web" || req.headers.mode == "web") {
        if (config1["Controls"]["USP"] == "UserProfile") {
          results[i1].USP_Name = "OpenSAP course catalog";
          results[i1].USP_Role = "copyright - SAP®";
          //   results[i1].USP_Image =
          //     "https://fierce-oasis-51455.herokuapp.com/logos/logo_opensap.png";
          results[i1].USP_Image = process.env.APPURL + "logos/logo_opensap.png";
        }
      }
    }
    outData["success"] = true;
    outData["data"] = results;
    outData["config"] = config1;

    if (req.headers.mode == "Web" || req.headers.mode == "web") {
      res.status(200).json({
        outData,
        possibleValues: resPV,
        //     defaultValues: ival_out,
      });
    } else {
      res.status(200).json({
        outData,
      });
    }
  } else {
    //// Data Source is mongoDB....
    //app = req.params.id;
    // Read New Config File

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

    /*   for (let a = 0; a < results.length; a++) {
    for (const key in results[a]) {
      for (let b = 0; b < config1.FieldDef.length; b++) {
        if (
          (config1.FieldDef[b]["type"] == "Date") &
          (config1.FieldDef[b]["name"] == key)
        ) {
          let myTemp = results[a][key];
          results[a][key] = typeof " ";
          results[a][key] = results[a][key].toString(results[a][key]);
          results[a]["New"] = String("2020-03-03");

          console.log(results[a][key]);
        }
      }
    }
  } */

    //  rag = [];

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
        if (req.headers.mode !== "BOTList") {
          results[i1]["ItemData"] = results2;
        }
      }
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
    }

    // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
    pvconfig1 = getPVConfig(
      req.headers.applicationid,
      req.headers.businessrole
    );
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
  }
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
  }
  // Add ID field in the Item Query... (Only for Items)
  // Read Possible Values Config.....(Required for Possible Values and BOT Buttons)
  // pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  // query = getPVQuery(
  //   req.headers.applicationid,
  //   req.headers.businessrole,
  //    pvconfig1
  // );
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
