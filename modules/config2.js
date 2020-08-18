const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
//const ErrorResponse = require("../utils/errorResponse");
var button = require("../bot/Supplier_button.json");
const Agent = require("../models/access/Agent");
const App = require("../models/appSetup/App");
const Role = require("../models/appSetup/Role");
const User = require("../models/access/User");
const { getBotListFields, getInitialValues } = require("./config");

const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const readFile = utils.promisify(fs.readFile);
const sendEmail = require("../utils/sendEmail");
const sendEmail1 = require("../utils/sendEmailProd");
module.exports = {
  donutCardHead: async function (mycard, appData1, anacardConfig) {
    measures1 = [];
    let mydc2 = {};
    let json1 = {};
    var set1 = new Set();
    set1.add(appData1[mycard["cardsDonut"]["measureName"]]);
    set1.forEach((val) => {
      mydc2["measureName"] = val;
      mydc2["value"] = 0;
      if (
        appData1[mycard["cardsDonut"]["measureName"]] == val &&
        mycard["cardsDonut"]["function"] == "SUM"
      ) {
        mydc2["value"] =
          Number(mydc2["value"]) +
          Number(appData1[mycard["cardsDonut"]["value"]]);
      }
      measures1.push({ ...mydc2 });
      mydc2 = {};
    });
    // Measurements...
    json1 = { ...anacardConfig["sap.card"].content.data.json };
    json1["measures"] = measures1;
    anacardConfig["sap.card"].content.data.json = {
      ...json1,
    };
    measures1 = [];
    json1 = {};
    return anacardConfig;
  },
  exampleCard: async function (mycard, appData1, anacardConfig) {
    return anacardConfig;
  },

  analyticalCard: async function (mycard, appData1, anacardConfig) {
    let mydc2 = {};
    let json1 = {};
    list1 = [];
    list1x = {};
    var set1 = new Set();
    if (mycard["cardsubType"] == "Donut") {
      for (let q = 0; q < appData1.length; q++) {
        set1.add(
          appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]]
        );
      }
      set1.forEach((val) => {
        mydc2["measureName"] = val;
        mydc2["Value2"] = 0;
        for (let q = 0; q < appData1.length; q++) {
          if (
            appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
              val &&
            mycard["analyticsCard"]["cardsDonut"]["function"] == "SUM"
          ) {
            mydc2["Value2"] =
              Number(mydc2["Value2"]) +
              Number(
                appData1[q][mycard["analyticsCard"]["cardsDonut"]["Value2"]]
              );
          }
          if (
            appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
              val &&
            mycard["analyticsCard"]["cardsDonut"]["function"] == "COUNT"
          ) {
            mydc2["Value2"] = Number(mydc2["Value2"]) + 1;
          }
        }
        list1.push({ ...mydc2 });
        mydc2 = {};
      });
      json1 = { ...anacardConfig["sap.card"].content.data.json };
      json1["list"] = list1;
      anacardConfig["sap.card"].content.data.json = {
        ...json1,
      };
    }
    if (
      mycard["cardsubType"] == "Line" ||
      mycard["cardsubType"] == "StackedBar" ||
      mycard["cardsubType"] == "StackedColumn"
    ) {
      let j_number = 10;
      let trend1 = "Down";
      let state1 = "Error";
      let details1 = "2019-2020";
      head1 = {};
      head1 = { ...anacardConfig["sap.card"].header };
      json1 = {
        ...anacardConfig["sap.card"].content.data.json,
      };
      for (let q = 0; q < appData1.length; q++) {
        for (const k1 in mycard["itemvalueMap"]) {
          const ek1 = mycard["itemvalueMap"][k1];
          if (appData1[q][ek1] != undefined) {
            list1x[k1] = appData1[q][ek1];
          } else {
            list1x[k1] = 0;
          }
        }
        for (const k1 in mycard["itemkeyMap"]) {
          const ek1 = mycard["itemkeyMap"][k1];
          if (appData1[q][ek1] != undefined) {
            list1x[k1] = appData1[q][ek1];
          } else {
            list1x[k1] = "NA";
          }
        }
        list1.push({ ...list1x });
      }
      json1["list"] = list1;
      anacardConfig["sap.card"].content.data.json.list = list1;
      js1 = {};
      js1 = { ...anacardConfig["sap.card"].header.data.json };
      js1["number"] = j_number;
      js1["trend"] = trend1;
      js1["state"] = state1;
      js1["details"] = details1;
      head1["data"]["json"] = { ...js1 };
      js1 = {};
      anacardConfig["sap.card"].header = { ...head1 };
      head1 = {};
    }

    list1 = [];
    json1 = {};
    list1x = {};
    return anacardConfig;
  },
  donutCard: async function (mycard, appData1, anacardConfig) {
    measures1 = [];
    let mydc2 = {};
    let json1 = {};

    var set1 = new Set();
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      set1.add(
        appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]]
      );
      filterSet.add(appData1[q][mycard["filterKey"]]);
    }
    // Measurements...
    set1.forEach((val) => {
      mydc2["measureName"] = val;
      mydc2["value"] = 0;
      for (let q = 0; q < appData1.length; q++) {
        if (
          appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
            val &&
          mycard["analyticsCard"]["cardsDonut"]["function"] == "SUM"
        ) {
          mydc2["value"] =
            Number(mydc2["value"]) +
            Number(appData1[q][mycard["analyticsCard"]["cardsDonut"]["value"]]);
        }
        if (
          appData1[q][mycard["analyticsCard"]["cardsDonut"]["measureName"]] ==
            val &&
          mycard["analyticsCard"]["cardsDonut"]["function"] == "COUNT"
        ) {
          mydc2["value"] = Number(mydc2["value"]) + 1;
        }
      }
      measures1.push({ ...mydc2 });
      mydc2 = {};
    });

    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    json1 = { ...anacardConfig["sap.card"].content.data.json };
    json1["measures"] = measures1;
    anacardConfig["sap.card"].content.data.json = {
      ...json1,
    };
    measures1 = [];
    json1 = {};
    return anacardConfig;
  },
  lineCard: async function (mycard, appData1, anacardConfig) {
    list1x = {};
    list1 = [];
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let details1 = "2019-2020";
    head1 = {};
    head1 = { ...anacardConfig["sap.card"].header };
    json1 = {
      ...anacardConfig["sap.card"].content.data.json,
    };
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      for (const k1 in mycard["analyticsCard"]["itemvalueMap"]) {
        filterSet.add(appData1[q][mycard["filterKey"]]);
        const ek1 = mycard["analyticsCard"]["itemvalueMap"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = 0;
        }
      }
      for (const k1 in mycard["analyticsCard"]["itemkeyMap"]) {
        const ek1 = mycard["analyticsCard"]["itemkeyMap"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = "NA";
        }
      }
      list1.push({ ...list1x });
    }
    json1["list"] = list1;
    anacardConfig["sap.card"].content.data.json.list = list1;
    js1 = {};
    js1 = { ...anacardConfig["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["details"] = details1;
    head1["data"]["json"] = { ...js1 };
    js1 = {};
    anacardConfig["sap.card"].header = { ...head1 };
    // Filters
    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    list1 = [];
    json1 = {};
    head1 = {};
    stru1 = anacardConfig;
    t_type = "Analytical";
    return stru1;
  },
  stackedcolumnCard: async function (mycard, appData1, anacardConfig) {
    stru1 = anacardConfig;
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let unitOfMeasurement = "GBP";
    let details1 = "2019-2020";
    head1 = {};
    head1 = { ...anacardConfig["sap.card"].header };

    json1 = {
      ...anacardConfig["sap.card"].content.data.json,
    };
    js1 = {};
    js1 = { ...anacardConfig["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["unit"] = unitOfMeasurement;
    head1["data"]["json"] = { ...js1 };
    anacardConfig["sap.card"].header = { ...head1 };

    js1 = {};
    list1 = [];
    list1x = {};
    var filterSet = new Set();
    for (let q = 0; q < appData1.length; q++) {
      list1x["Category"] =
        appData1[q][mycard["analyticsCard"]["colKey"]["Category"]];
      for (let t = 0; t < mycard["analyticsCard"]["colValues"].length; t++) {
        filterSet.add(appData1[q][mycard["filterKey"]]);
        list1x[mycard["analyticsCard"]["colValues"][t]] =
          appData1[q][mycard["analyticsCard"]["colValues"][t]];
      }
      for (const k1 in mycard["analyticsCard"]["colValues"]) {
        const ek1 = mycard["analyticsCard"]["colValues"][k1];
        if (appData1[q][ek1] != undefined) {
          list1x[k1] = appData1[q][ek1];
        } else {
          list1x[k1] = 0;
        }
      }
      list1.push({ ...list1x });
    }
    // Filters...
    rk = {};

    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    anacardConfig["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    anacardConfig["sap.card"].content.data.json.list = list1;

    list1 = [];
    json1 = {};
    head1 = {};

    return stru1;
  },
  listCard: async function (mycard, appData1, anacardConfig) {
    let fileNameColor = "../config/colorConfig.json";
    var colorConfig = require(fileNameColor);

    mergedFields = mycard["mergedFields"];
    fieldMap = mycard["fieldMap"];
    colorStatus = mycard["colorStatus"];
    out1 = [];
    outx = {};
    for (let u = 0; u < appData1.length; u++) {
      for (const kl in mergedFields) {
        outx[kl] = "";
        for (let i = 0; i < mergedFields[kl].length; i++) {
          switch (mergedFields[kl][i]) {
            case "@£":
              outx[kl] = outx[kl] + "£";
              break;
            case "@$":
              outx[kl] = outx[kl] + "$";
              break;
            case "@ ":
              outx[kl] = outx[kl] + " ";
              break;
            case "@>>":
              outx[kl] = outx[kl] + ">>";
              break;

            case "@>>":
              outx[kl] = outx[kl] + ">>";
              break;

            case "@Score:":
              outx[kl] = outx[kl] + "Score:";
              break;
            default:
              outx[kl] = outx[kl] + appData1[u][mergedFields[kl][i]];
              break;
          }
        }
      }
      for (const kl in fieldMap) {
        if (appData1[u].hasOwnProperty(fieldMap[kl])) {
          // switch (fieldMap[kl]) {
          //   case value:
          //     break;

          //   default:
          //     break;
          // }

          outx[kl] = appData1[u][fieldMap[kl]];
        }
      }
      outx["State"] = colorConfig["Status"][appData1[u][colorStatus]];
      outx["Highlight"] = colorConfig["Status"][appData1[u][colorStatus]];
      if (outx["State"] == undefined) {
        outx["State"] = "Warning";
      }
      if (outx["Highlight"] == undefined) {
        outx["Highlight"] = "Warning";
      }
      switch (outx["State"]) {
        case "Error":
          outx["ChartColor"] = "Error";
          break;
        case "Warning":
          outx["ChartColor"] = "Neutral";
          break;
        case "Information":
          outx["ChartColor"] = "Neutral";
          break;
        case "Success":
          outx["ChartColor"] = "Good";
          break;
        case "None":
          outx["ChartColor"] = "Neutral";
          break;
        default:
          break;
      }
      console.log("Data:", outx);
      out1.push({ ...outx });
      outx = {};
    }
    anacardConfig["sap.card"]["content"]["data"]["json"] = out1;
    return anacardConfig;
  },
  tableCard: async function (mycard, appData1, anacardConfig) {
    t_type = "table1";
    stru = anacardConfig;
    tabFields = mycard["tableCardFields"];
    xc_table1 = {};
    col_table1 = [];
    for (let b = 0; b < tabFields.length; b++) {
      xc_table1["title"] = tabFields[b];
      xc_table1["value"] = "{" + tabFields[b] + "}";
      xc_table1["identifier"] = false;
      col_table1.push({ ...xc_table1 });
      xc_table1 = {};
    }
    xj_table1 = {};
    json_table1 = [];
    tdata = [];
    xrow1 = {};
    xrow = {};
    var filterSet = new Set();
    for (let u = 0; u < appData1.length; u++) {
      filterSet.add(appData1[u][mycard["filterKey"]]);
      for (let b = 0; b < tabFields.length; b++) {
        xj_table1[tabFields[b]] = appData1[u][tabFields[b]];
      }
      json_table1.push({ ...xj_table1 });
      xj_table1 = {};
    }
    tdata["json"] = json_table1;
    json_table1 = [];
    xrow1["columns"] = col_table1;
    xrow["row"] = { ...xrow1 };
    xrow1 = {};
    col_table1 = [];
    stru["sap.card"]["content"] = { ...xrow };
    xrow = {};
    stru["sap.card"]["type"] = "Table";
    stru["sap.card"]["data"] = { ...tdata };
    // Filters....
    rk = {};
    fltr = [];
    filterSet.forEach((val1) => {
      rk["title"] = val1;
      rk["key"] = val1;
      fltr.push({ ...rk });
      rk = {};
    });
    stru["sap.card"]["configuration"]["filters"][mycard["filterKey"]][
      "items"
    ] = fltr;
    fltr = [];

    tdata = {};
    return stru;
  },
  globalCard: async function (appData1, GlobalCardConfig) {
    stru = GlobalCardConfig;
    stru["sap.card"]["header"]["title"] = "Processing Log";
    stru["sap.card"]["header"]["subTitle"] = "Historic Changes";

    let fg3 = "../cards/cardConfig/template_icon.json";
    var gicon = require(fg3);
    let timeline1_json = [];
    let xj1 = {};
    for (let n = 0; n < appData1.length; n++) {
      xj1["Icon"] = "sap-icon://accept";
      xj1["Title"] = appData1[n]["Comment"];
      xj1["Time"] = new Date(appData1[n]["TimeStamp"]);
      xj1["Description"] = appData1[n]["UserName"];
      if (appData1[n].hasOwnProperty("buttonName")) {
        xj1["Title"] = xj1["Title"] + " >> " + appData1[n]["buttonName"];
        xj1["Icon"] = gicon[appData1[n]["buttonName"]];
      }
      if (appData1[n].hasOwnProperty("UserComment")) {
        xj1["Description"] =
          xj1["Description"] + " >> " + appData1[n]["UserComment"];
      }
      timeline1_json.push({ ...xj1 });
      xj1 = {};
    }
    stru["sap.card"]["content"]["data"]["json"] = timeline1_json;
    timeline1_json = [];
    return stru;
  },
  adaptivecardCard: async function (appID, role, adCard) {
    let path1 = "../cards/adaptivecardforms/" + appID + "_" + role + ".json";
    let path2 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_actions.json";
    //    let path3 = "../cards/cardConfig/template_adaptiveForm.json";
    const cardbody = require(path1);
    const cardaction = require(path2);
    //  const adCard = require(path3);

    adCard["sap.card"]["content"]["body"] = cardbody["body"];
    adCard["sap.card"]["content"]["actions"] = cardaction["actions"];
    return adCard;
  },
  generatePdfCertificate: async function (getData) {
    var message =
      '<!DOCTYPE html><html lang="en" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="x-apple-disable-message-reformatting"><title></title><link href="https://fonts.googleapis.com/css?family=Lato:300,400,700" rel="stylesheet"><style>table {font-family: arial, sans-serif;border-collapse: collapse;width: 100%;}td, th {border: 1px solid #dddddd;text-align: left;padding: 8px;}tr:nth-child(even) {background-color: #dddddd;}</style></head><body width="100%" style="margin: 0; padding: 0 !important; mso-line-height-rule: exactly; background-color: #f1f1f1;"><div style="width:800px; height:600px; padding:20px; text-align:center; border: 10px solid #787878"><div style="width:750px; height:550px; padding:20px; text-align:center; border: 5px solid #787878"><span style="font-size:50px; font-weight:bold">Certificate of Completion</span><br><br><span style="font-size:25px"><i>This is to certify that</i></span><br><br><span style="font-size:30px"><b>[FULLNAME]</b></span><br/><br/><span style="font-size:25px"><i>has completed the course</i></span> <br/><br/><span style="font-size:30px">[COURSENAME]</span> <br/><br/><span style="font-size:20px">with score of <b>[SCORE]</b></span> <br/><br/><span style="font-size:25px"><i>dated</i></span><br>[DATE]</span></div></div></body></html>';

    message = message.replace("[FULLNAME]", getData["fullName"]);
    message = message.replace("[SCORE]", getData["score"]);
    message = message.replace("[DATE]", getData["generatedDate"]);
    message = message.replace("[COURSENAME]", getData["Title"]);

    try {
      sendEmail({
        email: "gst@smartphonebizapps.com",
        subject: "Congratulation you have completed the course",
        message,
      });

      getData["res"].status(200).json({
        success: true,
        message: "Course assigned to the user & Email sent 123",
      });
    } catch (err) {
      console.log(err);
      getData["res"].status(200).json({
        success: true,
        message: "Course assigned to the user but Email could not be sent",
      });
    }

    console.log("Certificate Sent..");
  },
  sendErrorMessage: function (what, chkVal, user) {
    const ErrorResponse = require("../utils/errorResponse");
    switch (what) {
      case "company":
        outMsg = `Company can not be determined for : ${user}`;
        break;
      case "role":
        outMsg = `Role can not be determined for : ${user}`;
        break;
      case "branch":
        outMsg = `Branch can not be determined for : ${user}`;
        break;
      case "area":
        outMsg = `Area can not be determined for : ${user}`;
        break;
      default:
        break;
    }
    let mgsObj;
    if (!chkVal) {
      mgsObj = new ErrorResponse(outMsg, 404);
    }

    return mgsObj;
  },
  cardReplace: function (mycard, cardData, appconfig) {
    if (mycard.title != undefined) {
      cardData = cardData.replace("@Title", mycard.title);
    } else {
      cardData = cardData.replace(
        "@Title",
        appconfig["Title"]["ApplicationTitle"]
      );
    }
    if (mycard.subTitle != undefined) {
      cardData = cardData.replace("@subTitle", mycard.subtitle);
    } else {
      cardData = cardData.replace(
        "@subTitle",
        appconfig["Title"]["DetailTitle"]
      );
    }
    cardData = cardData.replace("@unitOfMeasurement", mycard.unitOfMeasurement);
    cardData = cardData.replace("@filterKey", mycard["filterKey"]);
    cardData = cardData.replace("@filterKey", mycard["filterKey"]);
    cardData = cardData.replace("@filterKeyLabel", mycard["filterKeyLabel"]);
    cardData = cardData.replace("@filterKeyLabel", mycard["filterKeyLabel"]);
    cardData = cardData.replace("@HeaderActionURL", "applicationTile");
    return cardData;
  },
  getCardKey: function (a, b, c, d) {
    cKey = d + a.substring(0, 3) + a.slice(-2) + b.substring(0, 3) + c;
    return cKey;
  },

  getTotalCount: function (app, req, config1) {
    let config = {};
    fl1 = {};
    fl2 = [];
    let app2;
    let model2;

    // Get Table Schema
    let path = "../models/smartApp/" + app;
    const model = require(path);

    if (config1["itemData"] == "Yes") {
      app2 = app + "_Itm";
      let path = "../models/smartApp/" + app2;
      model2 = require(path);
    } else {
      model2 = model;
    }
    let query;
    const reqQuery1 = { ...req.query };
    // Filters...
    if (reqQuery1) {
      reqQuery1["company"] = req.user.company;
    }
    /// Initial values..
    var ivalue = getInitialValues(
      req.params.id,
      req.headers.businessrole,
      req.user
    );
    // Filters
    for (let x = 0; x < config1.Controls.Filters.length; x++) {
      for (const key in config1.Controls.Filters[x]) {
        if (config1.Controls.Filters[x].hasOwnProperty(key)) {
          switch (config1.Controls.Filters[x][key]) {
            case "@user":
              reqQuery1[key] = req.user.email;
              break;
            case "@CostCentre":
              for (let y = 0; y < ivalue.length; y++) {
                for (const key in ivalue[y]) {
                  if (ivalue[y]["Field"] == "CostCentre") {
                    reqQuery1["CostCentre"] = ivalue[y]["Value"];
                  }
                }
              }
              break;

            //     Status=ne|Complete
            default:
              reqQuery1[key] = config1.Controls.Filters[x][key];
              break;
          }
        }
      }
    }
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery1[param]);
    reqQuery2 = {};
    reqQuery = {};
    /////////////////////////////////////////////////////////////////
    /// Split Header and Item Queries
    rn = {};
    for (const key in reqQuery1) {
      var n = key.includes("ItemData");
      if ((n == true) & (model !== model2)) {
        const fList = key.split("_");
        reqQuery2[fList[1]] = reqQuery1[key];
        var r1 = reqQuery1[key].includes("ne"); // Add the logic for gt, lt etc...
        if (r1 == true) {
          rg01 = reqQuery1[key].split("|");
          rn[rg01[0]] = rg01[1];
          reqQuery2[fList[1]] = rn;
        }
      } else {
        reqQuery[key] = reqQuery1[key];
      }
    }
    // Create query string (Header)
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = model.find(JSON.parse(queryStr));
    query = query.select("ID");
    return query;
  },
  readData: function (app, req, config1) {
    fl1 = {};
    fl2 = [];
    let app2;
    let model2;
    // Get Table Schema
    let path = "../models/smartApp/" + app;
    const model = require(path);
    if (config1["itemData"] == "Yes") {
      app2 = app + "_Itm";
      let path = "../models/smartApp/" + app2;
      model2 = require(path);
    } else {
      model2 = model;
    }
    // Get BOT List Fields
    if (req.headers.mode == "BOTList") {
      let lf = getBotListFields(config1);
    }
    /////////////////////////////////////////////////////////////////////////////////////////////////
    // Executing query
    ////////////////////////////////////////////////////////////////////////////////////////////////
    let query;
    const reqQuery1 = { ...req.query };
    if (reqQuery1) {
      reqQuery1["company"] = req.user.company;
    }
    /// Initial values..
    var ivalue = getInitialValues(
      req.params.id,
      req.headers.businessrole,
      req.user
    );
    // Filters
    for (let x = 0; x < config1.Controls.Filters.length; x++) {
      for (const key in config1.Controls.Filters[x]) {
        if (config1.Controls.Filters[x].hasOwnProperty(key)) {
          switch (config1.Controls.Filters[x][key]) {
            case "@user":
              reqQuery1[key] = req.user.email;
              break;
            case "@CostCentre":
              for (let y = 0; y < ivalue.length; y++) {
                for (const key in ivalue[y]) {
                  if (ivalue[y]["Field"] == "CostCentre") {
                    reqQuery1["CostCentre"] = ivalue[y]["Value"];
                  }
                }
              }
              break;

            //     Status=ne|Complete
            default:
              reqQuery1[key] = config1.Controls.Filters[x][key];
              break;
          }
        }
      }
    }
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery1[param]);
    reqQuery2 = {};
    reqQuery = {};
    /////////////////////////////////////////////////////////////////
    /// Split Header and Item Queries
    rn = {};
    for (const key in reqQuery1) {
      var n = key.includes("ItemData");
      if ((n == true) & (model !== model2)) {
        const fList = key.split("_");
        reqQuery2[fList[1]] = reqQuery1[key];

        var r1 = reqQuery1[key].includes("ne"); // Add the logic for gt, lt etc...
        if (r1 == true) {
          rg01 = reqQuery1[key].split("|");
          rn[rg01[0]] = rg01[1];
          reqQuery2[fList[1]] = rn;
        }
      } else {
        reqQuery[key] = reqQuery1[key];
      }
    }

    // Create query string (Header)
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    /////////////////////////////////////////////////////////////////
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    let fields;
    if (req.headers.mode == "BOTList") {
      fields = lf.join(" ");
      query = query.select(fields);
    }
    /////////////////////////////////////////////////////////////////
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    //const total = await model.countDocuments();
    // query2 = query;
    if (req.headers.mode == "BOTList") {
      query = query.select(fields);
    }

    return query;
  },
  nConfig: function (app, req, config1) {
    let config = {};
    // Get BOT List Fields
    if (req.headers.mode == "BOTList") {
      let lf = getBotListFields(config1);
    }
    // check the Mode
    switch (req.headers.mode) {
      case "BOTList":
        config1["FieldDef"].forEach((element) => {
          lf.forEach((element2) => {
            if (element["name"] == element2) {
              fl1["name"] = element["name"];
              fl1["SLabel"] = element["SLabel"];
              fl2.push({ ...fl1 });
              fl1 = {};
            }
          });
        });
        config["Title"] = config1["Title"];
        config["ListBOTFields"] = config1["ListBOTFields"];
        config["ListBOTItemFields"] =
          config1["itemConfig"]["ListBOTItemFields"];
        config["FieldDef"] = fl2;
        break;

      case "BOTDetail":
        config["Title"] = config1["Title"];
        config["Tabs"] = config1["Tabs"];
        config["DetailFields"] = config1["DetailFields"];
        config["ListBOTItemFields"] =
          config1["itemConfig"]["ListBOTItemFields"];
        config["FieldDef"] = fl2;
        break;
      default:
        config = config1;
    }

    return config;
  },
};
