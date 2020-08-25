var randomstring = require("randomstring");
const asyncHandler = require("../../middleware/async");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
} = require("../../modules/config");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.validateAppSetup = asyncHandler(async (req, res, next) => {
  schemaExclude = [
    "TransLog",
    "MultiAttachments",
    "carouselImage",
    "StatusState",
    "USP_Image",
    "USP_Role",
    "USP_Name",
    "Partner",
    "buttons",
    "cardImage",
  ];
  DetailFieldsExclude = ["USP_Image", "USP_Role", "USP_Name"];
  let messages = [];
  let mStru = {};

  // Read New Config File
  /// Application Details..
  //--------------------------------------
  // 001 - Validation  - Check if Config File Exists
  //--------------------------------------
  let fn01 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config = require(fn01);
  if (!config) {
    mStru["type"] = "error";
    mStru["number"] = "001";
    mStru[
      "message"
    ] = `Config file missing for App: ${req.headers.applicationid} & Role: ${req.headers.businessrole}`;
    messages.push({ ...mStru });
    mStru = {};
  }
  //--------------------------------------
  // 002 - Validation  - Check if Schema exists
  //--------------------------------------
  // Read mongo Schema
  let fn02 = "../../applicationJSON/" + req.headers.applicationid + ".json";
  var mongoDBSchema = require(fn02);

  if (!mongoDBSchema) {
    mStru["type"] = "error";
    mStru["number"] = "002";
    mStru[
      "message"
    ] = `Schema file missing for App: ${req.headers.applicationid}`;
    messages.push({ ...mStru });
    mStru = {};
  }
  //--------------------------------------
  // 003 - Validation  - Model is missing
  //--------------------------------------
  // Read mongo Schema
  let fn03 = "../../applicationJSON/" + req.headers.applicationid + ".json";
  var tableModel = require(fn03);

  if (!tableModel) {
    mStru["type"] = "error";
    mStru["number"] = "003";
    mStru["message"] = `Model is missing for App: ${req.headers.applicationid}`;
    messages.push({ ...mStru });
    mStru = {};
  }

  //----------------------------------------------
  // 003A - Validation  - Model Vs Config (11*)
  //----------------------------------------------
  for (let a = 0; a < config["FieldDef"].length; a++) {
    if (mongoDBSchema.hasOwnProperty(config["FieldDef"][a]["name"])) {
      //  console.log("Field Matched", config["FieldDef"][a]["name"]);
    } else {
      mStru["type"] = "error";
      mStru["number"] = "11A";
      mStru[
        "message"
      ] = `Config Field ${config["FieldDef"][a]["name"]} missing in schema for App: ${req.headers.applicationid}`;
      messages.push({ ...mStru });
      mStru = {};
    }
  }
  //----------------------------------------------
  // 003B - Validation  - Model Vs Config (11*)
  //----------------------------------------------

  for (const key in mongoDBSchema) {
    match = false;
    for (let a = 0; a < config["FieldDef"].length; a++) {
      if (config["FieldDef"][a]["name"] == key) {
        match = true;
      }
      if (schemaExclude.includes(key)) {
        match = true;
      }
    }
    if (match == false) {
      mStru["type"] = "error";
      mStru["number"] = "11B";
      mStru[
        "message"
      ] = `Schema Field ${key} missing in config for App: ${req.headers.applicationid}`;
      messages.push({ ...mStru });
      mStru = {};
    }
  }
  //----------------------------------------------
  // 003B - Validation  - Possible Values (12*)
  //----------------------------------------------
  /// Possible values..
  pvconfig1 = getPVConfig(req.headers.applicationid, req.headers.businessrole);
  qPV = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvconfig1
  );
  let resPV = await qPV;

  for (let a = 0; a < config["PossibleValues"].length; a++) {
    match = false;
    for (let b = 0; b < resPV.length; b++) {
      if (config["PossibleValues"][a] == resPV[b]["PossibleValues"]) {
        match = true;
      }
    }
    if (match == false) {
      mStru["type"] = "error";
      mStru["number"] = "12B";
      mStru[
        "message"
      ] = `Possible Values for field ${config["PossibleValues"][a]} is missing for App: ${req.headers.applicationid}`;
      messages.push({ ...mStru });
      mStru = {};
    }
  }
  //----------------------------------------------
  // 003B - Validation  - Table Validations.....
  //----------------------------------------------
  for (let a = 0; a < config["Tabs"].length; a++) {
    if (config["Tabs"][a]["type"] == "Field") {
      fieldArr = config["DetailFields"][config["Tabs"][a]["value"]];
      for (let r = 0; r < fieldArr.length; r++) {
        match = false;
        for (let y = 0; y < config["FieldDef"].length; y++) {
          if (fieldArr[r] == config["FieldDef"][y]["name"]) {
            match = true;
          }
        }
        if (match == false) {
          mStru["type"] = "error";
          mStru["number"] = "190";
          mStru[
            "message"
          ] = `Detail Field ${fieldArr[r]} is missing in FieldDef for App: ${req.headers.applicationid}`;
          messages.push({ ...mStru });
          mStru = {};
        }
      }

      console.log(fieldArr);
    }

    if (config["Tabs"][a]["type"] == "Table") {
      console.log(config["Tabs"][a]["value"]);
      console.log(config["Tabs"][a]["name"]);
      // Check if key exists in Detail Fields
      console.log(config["DetailFields"][config["Tabs"][a]["value"]][0]);
    }
  }
  //----------------------------------------------
  // 003B - Validation  - Table Validations.....
  //----------------------------------------------

  res.status(200).json({
    success: true,
    data: messages,
  });
});
