var randomstring = require("randomstring");
const asyncHandler = require("../../middleware/async");
const {
  getPVConfig,
  getPVQuery,
  getAppRoles,
  getDateValues,
  getInitialValues,
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
    "ProgressComment",
    "ReferenceID"
  ];

  DetailFieldsExclude = ["USP_Image", "USP_Role", "USP_Name"];
  let messages = [];
  let mStru = {};

  console.log("-------------------------------------------------------------");
  console.log("--------                 APP                        ---------");
  console.log("APP:", req.headers.applicationid);
  console.log("-------------------------------------------------------------");

  let fn02 = "../../applicationJSON/" + req.headers.applicationid + ".json";
  var mongoDBSchema = require(fn02);

  if (!mongoDBSchema) {
    console.log("ERROR: Application Schema missing".red.inverse);
    mStru["type"] = "error";
    mStru["number"] = "002";
    mStru[
      "message"
    ] = `Schema file missing for App: ${req.headers.applicationid}`;
    messages.push({ ...mStru });
    mStru = {};
  } else{
    console.log("SUCCESS:Schema found".green.inverse);
  }

  AppRoles = await getAppRoles(req.headers.applicationid);

  for (let r = 0; r < AppRoles.length; r++) {
    const role = AppRoles[r]["role"];
    console.log("-------------------------------------------------------------");
    console.log("--------                 APP - ROLE                 ---------");
    console.log("APP:", req.headers.applicationid);
    console.log("ROLE:", role);
    console.log("-------------------------------------------------------------");


    //--------------------------------------
    // 002 - Validation  - Check if Config File Exists
    //--------------------------------------
    var config = {};
    let fn01 = "";

    fn01 =
      "../../NewConfig/" +
      req.headers.applicationid +
      "_" +
      role +
      "_config.json";

    config = require(fn01);
    if (!config) {
      console.log("ERROR: Config file missing");
      mStru["type"] = "error";
      mStru["number"] = "001";
      mStru[
        "message"
      ] = `Config file missing for App: ${req.headers.applicationid} & Role: ${role}`;
      messages.push({ ...mStru });
      mStru = {};
    }else{
      console.log("SUCCESS:Config File found".green.inverse);
    }

    console.log("-------- Tab Type and Field Type Validation ---------");
    for (let k = 0; k < config["Tabs"].length; k++) {
      // "carouselImage"
      if (config["Tabs"][k]["type"] == "carouselImage") {
        if (config["DetailFields"].hasOwnProperty(config["Tabs"][k]["value"])) {
          for (let m = 0; m < config["FieldDef"].length; m++) {
            if (
              config["FieldDef"][m]["name"] ==
              config["DetailFields"][config["Tabs"][k]["value"]][0]
            ) {
              if (config["FieldDef"][m]["type"] != "carouselImage") {
                console.log("Error...".red.inverse);
              }
              console.log(
                config["Tabs"][k]["type"],
                " - ",
                config["DetailFields"][config["Tabs"][k]["value"]][0],
                config["Tabs"][k]["value"],
                config["FieldDef"][m]["type"]
              );
            }
          }
        }
      }
      // "MultiAttachments"
      if (config["Tabs"][k]["type"] == "MultiAttachments") {
        if (config["DetailFields"].hasOwnProperty(config["Tabs"][k]["value"])) {
          for (let m = 0; m < config["FieldDef"].length; m++) {
            if (
              config["FieldDef"][m]["name"] ==
              config["DetailFields"][config["Tabs"][k]["value"]][0]
            ) {
              if (config["FieldDef"][m]["type"] != "attachment") {
                console.log("Error...".red.inverse);
              }
              console.log(
                config["Tabs"][k]["type"],
                " - ",
                config["DetailFields"][config["Tabs"][k]["value"]][0],
                config["Tabs"][k]["value"],
                config["FieldDef"][m]["type"]
              );
            }
          }
        }
      }
      // "Charts"
      if (config["Tabs"][k]["type"] == "Charts") {
        if (config["DetailFields"].hasOwnProperty(config["Tabs"][k]["value"])) {
          for (let m = 0; m < config["FieldDef"].length; m++) {
            if (
              config["FieldDef"][m]["name"] ==
              config["DetailFields"][config["Tabs"][k]["value"]][0]
            ) {
              if (config["FieldDef"][m]["type"] != undefined) {
                console.log("Error...".red.inverse);
              }
              console.log(
                config["Tabs"][k]["type"],
                " - ",
                config["DetailFields"][config["Tabs"][k]["value"]][0],
                config["Tabs"][k]["value"],
                config["FieldDef"][m]["type"]
              );
            }
          }
        }
      }
      // "Cards"
      if (config["Tabs"][k]["type"] == "Cards") {
        if (config["DetailFields"].hasOwnProperty(config["Tabs"][k]["value"])) {
          for (let m = 0; m < config["FieldDef"].length; m++) {
            if (
              config["FieldDef"][m]["name"] ==
              config["DetailFields"][config["Tabs"][k]["value"]][0]
            ) {
              if (config["FieldDef"][m]["type"] != undefined) {
                console.log("Error...".red.inverse);
              }
              console.log(
                config["Tabs"][k]["type"],
                " - ",
                config["DetailFields"][config["Tabs"][k]["value"]][0],
                config["Tabs"][k]["value"],
                config["FieldDef"][m]["type"]
              );
            }
          }
        }
      }
      // "Field"
      if ((config["Tabs"][k]["type"] = "Field")) {
        if (config["DetailFields"].hasOwnProperty(config["Tabs"][k]["value"])) {
          // console.log(
          //   "Field - ",
          //   config["DetailFields"][config["Tabs"][k]["value"]],
          //   config["Tabs"][k]["value"]
          // );
        }
      }
    }

    console.log("-------- Adaptive Card Setup ---------");
    for (let m = 0; m < config["FieldDef"].length; m++) {
      if (config["FieldDef"][m]["adaptiveCard"] == "Main") {
        console.log("Main".cyan.inverse, " - ", config["FieldDef"][m]["name"]);
      }
    }
    for (let m = 0; m < config["FieldDef"].length; m++) {
      if (config["FieldDef"][m]["adaptiveCard"] == "Additional") {
        console.log("Additional".magenta.inverse, " - ", config["FieldDef"][m]["name"]);
      }
    }
    for (let m = 0; m < config["FieldDef"].length; m++) {
      if (config["FieldDef"][m]["adaptiveCard"] == "None") {
        console.log("None", " - ", config["FieldDef"][m]["name"]);
      }
    }


  //----------------------------------------------
  // 003A - Validation  - Model Vs Config (11*)
  //----------------------------------------------
  for (let a = 0; a < config["FieldDef"].length; a++) {
    if (mongoDBSchema.hasOwnProperty(config["FieldDef"][a]["name"])) {
      //  console.log("Field Matched", config["FieldDef"][a]["name"]);
    } else {
      console.log("Error...".red.inverse);
      console.log(
        config["FieldDef"][a]["name"],
        " missing in Schema for ",
        req.headers.applicationid
      );
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

  // Initial values
  var ivalue = getInitialValues(
    req.headers.applicationid,
    role,
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

    //----------------------------------------------
  // 003B - Validation  - Possible Values (12*)
  //----------------------------------------------
  /// Possible values..
  pvconfig1 = getPVConfig(req.headers.applicationid, role);
  qPV = getPVQuery(
    req.headers.applicationid,
    role,
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
      if(fieldArr == undefined){
        console.log("Error...".red.inverse);
        console.log("Tab",config["Tabs"][a]["value"]);
      }
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

      //      console.log(fieldArr);
    }

    if (config["Tabs"][a]["type"] == "Table") {
      console.log(config["Tabs"][a]["value"]);
      console.log(config["Tabs"][a]["name"]);
      // Check if key exists in Detail Fields
      console.log(config["DetailFields"][config["Tabs"][a]["value"]][0]);
    }
  }

    //----------------------------------------------
  // 003B - Validation  - Wizard Validations.....
  //----------------------------------------------
  // Check all Mandatory fields are in Wizard
  def = config["FieldDef"];
  for (let c = 0; c < def.length; c++) {
    if (def[c]["Option"] == "Mandatory") {
      if (config["Wizard"].length > 0) {
        manField = false;
      } else {
        manField = true;
      }
      for (let a = 0; a < config["Wizard"].length; a++) {
        for (let b = 0; b < config["Wizard"][a]["fields"].length; b++) {
          if (def[c]["name"] == "ID") {
            manField = true;
          }
          if (def[c]["name"] == config["Wizard"][a]["fields"][b]["name"]) {
            manField = true;
          }
        }
      }
      if (manField == false) {
        console.log("Attn...".brown.inverse);
        if (schemaExclude.includes(def[c]["name"])) {
          console.log("Field Excluded: ", def[c]["name"]);
        } else {
          for (let a = 0; a < ival_out.length; a++) {
            if (def[c]["name"] == ival_out[a]["Field"]) {
              console.log("USer provided input for: ", ival_out[a]["Field"], ival_out[a]["Value"]);
            }
         }
        }
        console.log("Mandatory Field not setup in Wizard", def[c]["name"]);
        mStru["type"] = "error";
        mStru["number"] = "wizard01";
        mStru[
          "message"
        ] = `Mandatory Field ${def[c]["name"]} is missing in Wizard for App: ${req.headers.applicationid}`;
        messages.push({ ...mStru });
        mStru = {};
      }
    }
  }
  // Check all Wizard fields are in Field Def
  for (let a = 0; a < config["Wizard"].length; a++) {
    for (let b = 0; b < config["Wizard"][a]["fields"].length; b++) {
      matchField = false;
      for (let c = 0; c < def.length; c++) {
        if (def[c]["name"] == config["Wizard"][a]["fields"][b]["name"]) {
          matchField = true;
        }
      }
      if (matchField == false) {
        console.log("Error...".red.inverse);
        console.log(
          "Wizard Field not setup",
          config["Wizard"][a]["fields"][b]["name"]
        );
        mStru["type"] = "error";
        mStru["number"] = "wizard01";
        mStru[
          "message"
        ] = `Wizard Field ${config["Wizard"][a]["fields"][b]["name"]} is missing in FieldDef for App: ${req.headers.applicationid}`;
        messages.push({ ...mStru });
        mStru = {};
      }
    }
  }
  //XXX
  }

  // //--------------------------------------
  // // 003 - Validation  - Model is missing
  // //--------------------------------------
  // // Read mongo Schema
  // let fn03 = "../../applicationJSON/" + req.headers.applicationid + ".json";
  // var tableModel = require(fn03);

  // if (!tableModel) {
  //   mStru["type"] = "error";
  //   mStru["number"] = "003";
  //   mStru["message"] = `Model is missing for App: ${req.headers.applicationid}`;
  //   messages.push({ ...mStru });
  //   mStru = {};
  // }







  //----------------------------------------------
  // 003B - Validation  - Table Validations.....
  //----------------------------------------------



  res.status(200).json({
    success: true,
    data: messages,
  });
});
