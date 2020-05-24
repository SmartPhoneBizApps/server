const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");
const { getNewConfig } = require("../../modules/config");

const User = require("../../models/access/User");
//const Approle = require("../../models/appSetup/Approle");
const BUS0000001 = require("../../models/smartApp/BUS0000002");
const BUS0000002 = require("../../models/smartApp/BUS0000002");
const BUS0000003 = require("../../models/smartApp/BUS0000003");
const BUS0000004 = require("../../models/smartApp/BUS0000004");
const BUS0000005 = require("../../models/smartApp/BUS0000005");
const BUS0000006 = require("../../models/smartApp/BUS0000006");
const COUNCIL001 = require("../../models/smartApp/COUNCIL001");
const COUNCIL002 = require("../../models/smartApp/COUNCIL002");
const COUNCIL003 = require("../../models/smartApp/COUNCIL003");
const COUNCIL007 = require("../../models/smartApp/COUNCIL007");
const COUNCIL012 = require("../../models/smartApp/COUNCIL012");
const COUNCIL015 = require("../../models/smartApp/COUNCIL015");
const COUNCIL022 = require("../../models/smartApp/COUNCIL022");
const COUNCIL023 = require("../../models/smartApp/COUNCIL023");
const COUNCIL026 = require("../../models/smartApp/COUNCIL026");
const COUNCIL029 = require("../../models/smartApp/COUNCIL029");
const COUNCIL033 = require("../../models/smartApp/COUNCIL033");
const COUNCIL034 = require("../../models/smartApp/COUNCIL034");
const COUNCIL035 = require("../../models/smartApp/COUNCIL035");
const COUNCIL036 = require("../../models/smartApp/COUNCIL036");
const DOC00001 = require("../../models/smartApp/DOC00001");
const DOC00002 = require("../../models/smartApp/DOC00002");
const DOC00003 = require("../../models/smartApp/DOC00003");
const EDU00001 = require("../../models/smartApp/EDU00001");
const EDU00002 = require("../../models/smartApp/EDU00002");
const EDU00003 = require("../../models/smartApp/EDU00003");
const EDU00004 = require("../../models/smartApp/EDU00004");
const EDU00005 = require("../../models/smartApp/EDU00005");
const EDU00006 = require("../../models/smartApp/EDU00006");
const EDU00007 = require("../../models/smartApp/EDU00007");
const EDU00008 = require("../../models/smartApp/EDU00008");
const EDU00009 = require("../../models/smartApp/EDU00009");
const EDU00010 = require("../../models/smartApp/EDU00010");
const EDU00011 = require("../../models/smartApp/EDU00011");
const EDU00013 = require("../../models/smartApp/EDU00013");
const EDU00014 = require("../../models/smartApp/EDU00014");
const EDU00015 = require("../../models/smartApp/EDU00015");
const EDU00016 = require("../../models/smartApp/EDU00016");
const EDU00018 = require("../../models/smartApp/EDU00018");
const EDU00019 = require("../../models/smartApp/EDU00019");
const EDU00021 = require("../../models/smartApp/EDU00021");
const EDU00097 = require("../../models/smartApp/EDU00097");
const EDU00098 = require("../../models/smartApp/EDU00098");
const EDU0100 = require("../../models/smartApp/EDU0100");
const EMP00001 = require("../../models/smartApp/EMP00001");
const EMP00002 = require("../../models/smartApp/EMP00002");
const EMP00004 = require("../../models/smartApp/EMP00004");
const EMP00006 = require("../../models/smartApp/EMP00006");
const EMP00006OLD = require("../../models/smartApp/EMP00006OLD");
const EMP00008 = require("../../models/smartApp/EMP00008");
const EMP00013 = require("../../models/smartApp/EMP00013");
const EMP00021 = require("../../models/smartApp/EMP00021");
const EMPACC01 = require("../../models/smartApp/EMPACC01");
const EMPBOK01 = require("../../models/smartApp/EMPBOK01");
const ERP00002 = require("../../models/smartApp/ERP00002");
const ERP00003 = require("../../models/smartApp/ERP00003");
const ERP00004 = require("../../models/smartApp/ERP00004");
const ERP00005 = require("../../models/smartApp/ERP00005");
const ERP00008 = require("../../models/smartApp/ERP00008");
const ERP00009 = require("../../models/smartApp/ERP00009");
const ERP00010 = require("../../models/smartApp/ERP00010");
const ERP00014 = require("../../models/smartApp/ERP00014");
const HOSP0003 = require("../../models/smartApp/HOSP0003");
const HOSP0004 = require("../../models/smartApp/HOSP0004");
const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
const JOB00001 = require("../../models/smartApp/JOB00001");
const LOG00001 = require("../../models/smartApp/LOG00001");
const LOG00002 = require("../../models/smartApp/LOG00002");
const LOG00003 = require("../../models/smartApp/LOG00003");
const LOG00004 = require("../../models/smartApp/LOG00004");
const PM00001 = require("../../models/smartApp/PM00001");
const SUPP00011 = require("../../models/smartApp/SUPP00011");
const SUPP00012 = require("../../models/smartApp/SUPP00012");
const SUPP00013 = require("../../models/smartApp/SUPP00013");
const SUPP00014 = require("../../models/smartApp/SUPP00014");
const SUPP00015 = require("../../models/smartApp/SUPP00015");
const SUPP00016 = require("../../models/smartApp/SUPP00016");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
let myD = { json: [] };
let myO = { json: {} };
let myX = { json: {}, path: "/measures" };
let measures = [];
function getData(Model, q1) {
  let qg1 = JSON.parse(q1);
  query = Model.find(qg1, { _id: 0 });
  return query;
}
con = 0;
jsonArray = [];
jsonObject = {};
myTiles = {};
counter = 0;
tabCX = {};
let cardTemplate = {};

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCards = async (req, res, next) => {
  // Read Role from Parameter..
  role = req.params.role;
  // Read RecordID from Parameter..
  record = req.params.record;
  // Read AppID from Parameter..
  applicationID = req.params.app;
  // Read Card Configuration for the Role (X1)
  //let fn1 = "../../NewConfig/" + applicationID + "_" + role + "_config.json";
  //var appconfig = require(fn1);

  // Read New Config File
  var appconfig = getNewConfig(applicationID, role);

  //Validate Data...
  if (role.roleAccess != "External") {
    if (!req.user.company) {
      return next(
        new ErrorResponse(
          `User setup for Company is not complete ${req.user.email}`,
          404
        )
      );
    }
    if (
      !req.user.branch &
      (req.user.role == "BranchAdmin" || req.user.role == "BranchUser")
    ) {
      return next(
        new ErrorResponse(
          `User setup for Branch is not complete ${req.user.email}`,
          404
        )
      );
    }
    if (
      !req.user.area &
      (req.user.role == "AreaAdmin" || req.user.role == "AreaUser")
    ) {
      return next(
        new ErrorResponse(
          `User setup for Area is not complete ${req.user.email}`,
          404
        )
      );
    }
  }

  appconfig["Tabs"].forEach((element) => {
    if (element["type"] == "Cards") {
      tab = element.value;
    }
  });

  // Read Card Configuration for the Role (X1)
  let fileName = "../../cards/cardConfig/" + role + "_detailCardConfig.json";
  var cardConfig = require(fileName);

  // Read Color Configuration
  let fileNameColor = "../../cards/cardConfig/colorConfig.json";
  var colorConfig = require(fileNameColor);

  // Read card User Settings  for the Role
  let fileName2 = "../../userSettings/" + req.user.email + "_cardsSetup.json";
  var userSetCards = require(fileName2);
  console.log("App:", applicationID);
  // Get App Record Data
  switch (applicationID) {
    case "User":
      rec = await User.findById(req.params.id);
      break;
    case "BUS0000001":
      rec = await BUS0000001.findById(req.params.record);
      break;
    case "BUS0000002":
      rec = await BUS0000002.findById(req.params.record);
      break;
    case "BUS0000003":
      rec = await BUS0000003.findById(req.params.record);
      break;
    case "BUS0000004":
      rec = await BUS0000004.findById(req.params.record);
      break;
    case "BUS0000005":
      rec = await BUS0000005.findById(req.params.record);
      break;
    case "BUS0000006":
      rec = await BUS0000006.findById(req.params.record);
      break;
    case "COUNCIL001":
      rec = await COUNCIL001.findById(req.params.record);
      break;
    case "COUNCIL002":
      rec = await COUNCIL002.findById(req.params.record);
      break;
    case "COUNCIL022":
      rec = await COUNCIL022.findById(req.params.record);
      break;
    case "COUNCIL023":
      rec = await COUNCIL023.findById(req.params.record);
      break;
    case "COUNCIL026":
      rec = await COUNCIL026.findById(req.params.record);
      break;
    case "COUNCIL029":
      rec = await COUNCIL029.findById(req.params.record);
      break;
    case "COUNCIL033":
      rec = await COUNCIL033.findById(req.params.record);
      break;
    case "COUNCIL034":
      rec = await COUNCIL034.findById(req.params.record);
      break;
    case "COUNCIL035":
      rec = await COUNCIL035.findById(req.params.record);
      break;
    case "COUNCIL036":
      rec = await COUNCIL036.findById(req.params.record);
      break;
    case "DOC00001":
      rec = await DOC00001.findById(req.params.record);
      break;
    case "DOC00002":
      rec = await DOC00002.findById(req.params.record);
      break;
    case "DOC00003":
      rec = await DOC00003.findById(req.params.record);
      break;
    case "EDU00001":
      rec = await EDU00001.findById(req.params.record);
      break;
    case "EDU00002":
      rec = await EDU00002.findById(req.params.record);
      break;
    case "EDU00003":
      rec = await EDU00003.findById(req.params.record);
      break;
    case "EDU00004":
      rec = await EDU00004.findById(req.params.record);
      break;
    case "EDU00005":
      rec = await EDU00005.findById(req.params.record);
      break;
    case "EDU00006":
      rec = await EDU00006.findById(req.params.record);
      break;
    case "EDU00007":
      rec = await EDU00007.findById(req.params.record);
      break;
    case "EDU00008":
      rec = await EDU00008.findById(req.params.record);
      break;
    case "EDU00009":
      rec = await EDU00009.findById(req.params.record);
      break;
    case "EDU00010":
      rec = await EDU00010.findById(req.params.record);
      break;
    case "EDU00011":
      rec = await EDU00011.findById(req.params.record);
      break;
    case "EDU00013":
      rec = await EDU00013.findById(req.params.record);
      break;
    case "EDU00014":
      rec = await EDU00014.findById(req.params.record);
      break;
    case "EDU00015":
      rec = await EDU00015.findById(req.params.record);
      break;
    case "EDU00016":
      rec = await EDU00016.findById(req.params.record);
      break;
    case "EDU00018":
      rec = await EDU00018.findById(req.params.record);
      break;
    case "EDU00019":
      rec = await EDU00019.findById(req.params.record);
      break;
    case "EDU00021":
      rec = await EDU00021.findById(req.params.record);
      break;
    case "EDU00097":
      rec = await EDU00097.findById(req.params.record);
      break;
    case "EDU00098":
      rec = await EDU00098.findById(req.params.record);
      break;
    case "EDU0100":
      rec = await EDU0100.findById(req.params.record);
      break;
    case "EMP00001":
      rec = await EMP00001.findById(req.params.record);
      break;
    case "EMP00002":
      rec = await EMP00002.findById(req.params.record);
      break;
    case "EMP00004":
      rec = await EMP00004.findById(req.params.record);
      break;
    case "EMP00006OLD":
      rec = await EMP00006OLD.findById(req.params.record);
      break;
    case "EMP00006":
      rec = await EMP00006.findById(req.params.record);
      break;
    case "EMP00008":
      rec = await EMP00008.findById(req.params.record);
      break;
    case "EMP00013":
      rec = await EMP00013.findById(req.params.record);
      break;
    case "EMP00021":
      rec = await EMP00021.findById(req.params.record);
      break;
    case "EMPACC01":
      rec = await EMPACC01.findById(req.params.record);
      break;
    case "EMPBOK01":
      rec = await EMPBOK01.findById(req.params.record);
      break;
    case "ERP00002":
      rec = await ERP00002.findById(req.params.record);
      break;
    case "ERP00003":
      rec = await ERP00003.findById(req.params.record);
      break;
    case "ERP00004":
      rec = await ERP00004.findById(req.params.record);
      break;
    case "ERP00005":
      rec = await ERP00005.findById(req.params.record);
      break;
    case "ERP00008":
      rec = await ERP00008.findById(req.params.record);
      break;
    case "ERP00009":
      rec = await ERP00009.findById(req.params.record);
      break;
    case "ERP00010":
      rec = await ERP00010.findById(req.params.record);
      break;
    case "ERP00014":
      rec = await ERP00014.findById(req.params.record);
      break;
    case "HOSP0003":
      rec = await HOSP0003.findById(req.params.record);
      break;
    case "HOSP0004":
      rec = await HOSP0004.findById(req.params.record);
      break;
    case "ITPROJ002":
      rec = await ITPROJ002.findById(req.params.record);
      break;
    case "JOB00001":
      rec = await JOB00001.findById(req.params.record);
      break;
    case "LOG00001":
      rec = await LOG00001.findById(req.params.record);
      break;
    case "LOG00002":
      rec = await LOG00002.findById(req.params.record);
      break;
    case "LOG00003":
      rec = await LOG00003.findById(req.params.record);
      break;
    case "LOG00004":
      rec = await LOG00004.findById(req.params.record);
      break;
    case "PM00001":
      rec = await PM00001.findById(req.params.record);
      break;
    case "SUPP00011":
      rec = await SUPP00011.findById(req.params.record);
      break;
    case "SUPP00012":
      rec = await SUPP00012.findById(req.params.record);
      break;
    case "SUPP00013":
      rec = await SUPP00013.findById(req.params.record);
      break;
    case "SUPP00014":
      rec = await SUPP00014.findById(req.params.record);
      break;
    case "SUPP00015":
      rec = await SUPP00015.findById(req.params.record);
      break;
    case "SUPP00016":
      rec = await SUPP00016.findById(req.params.record);
      break;
    case "SUPP00018":
      rec = await SUPP00018.findById(req.params.record);
      console.log("Records", rec);
      break;
    case "SUPP00028":
      rec = await SUPP00028.findById(req.params.record);
      console.log("Records", rec);
      break;
    default:
    // code block
  }

  // Get Cards Details....
  // Loop Card Configuration for the Role (X1)
  for (const k2 in cardConfig.Tabs) {
    // Filter the Card Configuration data for the request tab (Tab1, tab2 etc..)
    if (cardConfig.Tabs.hasOwnProperty(k2)) {
      tab = tabCX[tab];
      tabCX[tab] = { ...cardConfig.Tabs[k2] };
      // Now loop through Tiles... in Card Configuration
      console.log("Card Setup", tabCX[tab].Tiles);
      for (const key3 in tabCX[tab].Tiles) {
        if (tabCX[tab].Tiles.hasOwnProperty(key3)) {
          let configCardID = tabCX[tab].Tiles[key3].CardID;
          console.log("FielName", configCardID);
          // Filtering the userSettings data based on application ID
          app_detail = applicationID + "_Detail";
          myData = userSetCards[role][app_detail];
          // Looping the USers Settings data
          for (const key4 in myData) {
            if (myData.hasOwnProperty(key4) & (myData[key4] == true)) {
              if (key4 == configCardID) {
                //////////////////////////////////////////////////////////////////////////////
                // Here user setup is matched with the card setup... Build the card output
                //////////////////////////////////////////////////////////////////////////////
                con = con + 1;
                jsonArray["json" + con] = rec;
                // Read Card Template
                let fileName3 = [];

                fileName3[con] =
                  "../../cards/templates/" +
                  tabCX[tab].Tiles[key3].Type +
                  "_template.json";
                key = {};
                key["con" + con] = require(fileName3[con]);
                console.log("FielName", fileName3[con]);
                console.log("Template", tabCX[tab].Tiles[key3].Type);
                console.log("Template", key["con" + con]);

                //-------------------------------------------------
                //Set Header ... All Cards
                key["con" + con]["sap.card"]["header"] =
                  tabCX[tab].Tiles[key3].header;

                console.log("Header", tabCX[tab].Tiles[key3]);
                //-------------------------------------------------
                //object1 : set group
                if (tabCX[tab].Tiles[key3].Type == "object1") {
                  key["con" + con]["sap.card"]["content"]["groups"][key3] =
                    tabCX[tab].Tiles[key3].groups;
                  // Add Data
                  let jg01 = {
                    name: "Atul Gupta",
                    position: "Director",
                    mobile: "+1 202 34869-0",
                    phone: "+1 202 555 5555",
                    email: "donna@peachvalley.com",
                  };
                  myO["json"] = { ...jg01 };
                  key["con" + con]["sap.card"]["data"] = { ...myO };
                  myO = { json: {} };
                }
                //-------------------------------------------------
                //table1
                if (tabCX[tab].Tiles[key3].Type == "table1A") {
                  ///// Set Coloumns ////////
                  key["con" + con]["sap.card"]["content"]["row"][
                    "columns"
                  ] = tabCX[tab].Tiles[key3].columns.slice(0);

                  /// Add JSON Data
                  key["con" + con]["sap.card"]["data"]["json"] = jsonArray[
                    "json" + con
                  ].slice(0);
                }
                //-------------------------------------------------
                //table1
                if (tabCX[tab].Tiles[key3].Type == "table1B") {
                  ///// Set Coloumns ////////
                  key["con" + con]["sap.card"]["content"]["row"][
                    "columns"
                  ] = tabCX[tab].Tiles[key3].columns.slice(0);
                  /// Add JSON Data
                  jl1 = {};
                  jsonArray["json" + con].forEach((ex2) => {
                    jl1 = ex2;
                    jl1["statusState"] = colorConfig["Status"][ex2["Status"]];
                  });

                  key["con" + con]["sap.card"]["data"]["json"] = jsonArray[
                    "json" + con
                  ].slice(0);
                }
                //--------------------
                //set group for action card
                //object1
                if (tabCX[tab].Tiles[key3].Type == "object1") {
                  key["con" + con]["sap.card"]["content"]["actions"] =
                    tabCX[tab].Tiles[key3].actions;
                }
                //list2 - Actions
                if (tabCX[tab].Tiles[key3].Type == "list2A") {
                  key["con" + con]["sap.card"]["content"]["item"]["actions"] =
                    tabCX[tab].Tiles[key3].actions;
                  /// Add Data
                  jsonOut = {};
                  jsonOutArray = [];
                  name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                  description1 = tabCX[tab].Tiles[key3].fieldMap["description"];
                  icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                  k = 0;
                  jsonArray["json" + con].forEach((eln1) => {
                    jsonOut["name"] = eln1[name1];
                    jsonOut["description"] = eln1[description1];
                    jsonOut["icon"] = icon1;
                    jsonOut["statusState"] =
                      colorConfig["Status"][eln1["Status"]];
                    jsonOutArray.push({ ...jsonOut });
                  });
                  /// Add Data
                  myD["json"] = jsonOutArray;
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }
                //list2 - Actions
                if (tabCX[tab].Tiles[key3].Type == "list2B") {
                  key["con" + con]["sap.card"]["content"]["item"]["actions"] =
                    tabCX[tab].Tiles[key3].actions;
                  /// Add Data
                  myD["json"] = jsonArray["json" + con];
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }
                //list1 - Data
                if (tabCX[tab].Tiles[key3].Type == "list1A") {
                  jsonOut = {};
                  jsonOutArray = [];
                  name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                  description1 = tabCX[tab].Tiles[key3].fieldMap["description"];
                  info1 = tabCX[tab].Tiles[key3].fieldMap["info"];
                  icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                  k = 0;
                  jsonArray["json" + con].forEach((eln1) => {
                    jsonOut["name"] = eln1[name1];
                    jsonOut["description"] = eln1[description1];
                    jsonOut["info"] = eln1[info1];
                    jsonOut["icon"] = icon1;
                    jsonOut["infoState"] =
                      colorConfig["Status"][eln1["Status"]];
                    jsonOutArray.push({ ...jsonOut });
                  });
                  /// Add Data
                  myD["json"] = jsonOutArray;
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }
                //list1 - Data
                if (tabCX[tab].Tiles[key3].Type == "list1B") {
                  jsonOut = {};
                  jsonOutArray = [];
                  name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                  description1 = tabCX[tab].Tiles[key3].fieldMap["description"];
                  info1 = tabCX[tab].Tiles[key3].fieldMap["info"];
                  icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                  k = 0;
                  jsonArray["json" + con].forEach((eln1) => {
                    jsonOut["name"] = eln1[name1];
                    jsonOut["description"] = eln1[description1];
                    jsonOut["info"] = eln1[info1];
                    jsonOut["icon"] = icon1;
                    jsonOut["infoState"] =
                      colorConfig["Status"][eln1["Status"]];
                    jsonOutArray.push({ ...jsonOut });
                  });
                  /// Add Data
                  myD["json"] = jsonOutArray;
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }

                if (tabCX[tab].Tiles[key3].Type == "quicklinks1") {
                  /// Add Data
                  myD["json"] = { ...jsonArray["json" + con] };
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }

                // timeline1A
                if (tabCX[tab].Tiles[key3].Type == "timeline1A") {
                  jsonOut = {};
                  jsonOutArray = [];

                  jsonOut["Title"] = "Document Created";
                  jsonOut["Description"] = "Document was created by Atul Gupta";
                  jsonOut["Icon"] = "sap-icon://create";
                  jsonOut["Time"] = "01-05-2020, 10:30";
                  jsonOutArray.push({ ...jsonOut });
                  jsonOut = {};
                  if (jsonArray["json" + con]["Status"] == "Approved") {
                    jsonOut["Title"] = "Document Approved";
                    jsonOut["Description"] =
                      "Document is approved by King Smith";
                    jsonOut["Icon"] = "sap-icon://approvals";
                    jsonOut["Time"] = "01-05-2020, 10:30";
                    jsonOutArray.push({ ...jsonOut });
                    jsonOut = {};
                  }
                  if (jsonArray["json" + con]["Status"] == "Cancelled") {
                    jsonOut["Title"] = "Document Cancelled";
                    jsonOut["Description"] =
                      "Document is cancelled by Requester";
                    jsonOut["Icon"] = "sap-icon://cancel";
                    jsonOut["Time"] = "01-05-2020, 10:30";
                    jsonOutArray.push({ ...jsonOut });
                    jsonOut = {};
                  }

                  /// Add Data
                  myD["json"] = jsonOutArray;
                  key["con" + con]["sap.card"]["content"]["data"] = {
                    ...myD,
                  };
                  jsonArray["json" + con] = [];
                }

                //Donut
                if (tabCX[tab].Tiles[key3].Type == "donut1A") {
                  jsonOut = {};
                  jsonOutArray = [];

                  jsonOut["measureName"] = "PO Value";
                  jsonOut["value"] = 300;
                  measures.push({ ...jsonOut });

                  jsonOut["measureName"] = "GR Value";
                  jsonOut["value"] = 200;
                  measures.push({ ...jsonOut });

                  jsonOut["measureName"] = "Invoice Value";
                  jsonOut["value"] = 270;
                  measures.push({ ...jsonOut });
                  myX["json"]["measures"] = measures;
                  key["con" + con]["sap.card"]["content"]["data"] = { ...myX };
                  myX = { json: {}, path: "/measures" };
                  measures = [];

                  /// Add Data

                  jsonArray["json" + con] = [];
                }

                counter = counter + 1;
                let TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                myTiles[TileID] = Object.assign({}, key["con" + con]);
                key["con" + con] = {};
                //////////////////////////////////////////////////////////////////////////////
                // Ends
                //////////////////////////////////////////////////////////////////////////////
              }
            }
          }
        }
      }
      /// Add Tiles in the output........
      cardTemplate = { ...myTiles };
      myTiles = {};
    }
  }
  // console.log("API Output for other tabs... : ", cardTemplate);
  res.status(200).json({ success: true, data: cardTemplate });
  cardTemplate = {};
};
