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
  donutCard: async function (mycard, appData1, outStru, appconfig1, ID, key) {
    // Read cart Analytical Template...
    let cardConfigFile1 = "../cards/cardConfig/" + mycard["template"];
    var anacardConfig = require(cardConfigFile1);
    measures1 = [];
    let mydc2 = {};
    let json1 = {};
    let head1 = {};
    let stru1 = {};
    var set1 = new Set();

    for (let q = 0; q < appData1.length; q++) {
      set1.add(appData1[q][mycard["cardsDonut"]["measureName"]]);
    }
    set1.forEach((val) => {
      mydc2["measureName"] = val;
      mydc2["value"] = 0;
      for (let q = 0; q < appData1.length; q++) {
        if (
          appData1[q][mycard["cardsDonut"]["measureName"]] == val &&
          mycard["cardsDonut"]["function"] == "SUM"
        ) {
          mydc2["value"] =
            Number(mydc2["value"]) +
            Number(appData1[q][mycard["cardsDonut"]["value"]]);
        }
        if (
          appData1[q][mycard["cardsDonut"]["measureName"]] == val &&
          mycard["cardsDonut"]["function"] == "COUNT"
        ) {
          mydc2["value"] = Number(mydc2["value"]) + 1;
        }
      }
      measures1.push({ ...mydc2 });
      mydc2 = {};
    });

    // Header....
    head1 = { ...anacardConfig["Structure"]["sap.card"].header };
    head1["title"] =
      appconfig1["title"] + " (" + mycard["cardsDonut"]["subtitle"] + ")";
    anacardConfig["Structure"]["sap.card"].header = { ...head1 };
    head1 = {};

    // Measurements...
    json1 = { ...anacardConfig["Structure"]["sap.card"].content.data.json };
    json1["measures"] = measures1;
    anacardConfig["Structure"]["sap.card"].content.data.json = {
      ...json1,
    };
    measures1 = [];
    json1 = {};

    // Card ID...
    t_type = "Analytical";
    let st1 = t_type + "_" + ID + "_" + key + mycard["cardsDonut"]["cardID"];

    // Add to the card...
    console.log("Rashmi", anacardConfig["Structure"]);
    stru1 = { ...anacardConfig["Structure"] };
    outStru[st1] = { ...stru1 };
    stru1 = {};
    return outStru;
  },
  lineCard: async function (mycard, appData1, outStru, appconfig1, ID, key) {
    // Read cart Analytical Template...
    let cardConfigFile1 = "../cards/cardConfig/" + mycard["template"];
    var anacardConfig = require(cardConfigFile1);
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let details1 = "2019-2020";
    head1 = {};
    head1 = { ...anacardConfig["Structure"]["sap.card"].header };
    json1 = {
      ...anacardConfig["Structure"]["sap.card"].content.data.json,
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
    anacardConfig["Structure"]["sap.card"].content.data.json.list = list1;
    //  list1 = [];
    head1["title"] = appconfig1["title"];
    head1["subTitle"] = appconfig1["subTitle"];
    head1["unitOfMeasurement"] = appconfig1["unitOfMeasurement"];
    js1 = {};
    js1 = { ...anacardConfig["Structure"]["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["details"] = details1;
    head1["data"]["json"] = { ...js1 };
    js1 = {};
    anacardConfig["Structure"]["sap.card"].header = { ...head1 };
    list1 = [];
    json1 = {};
    head1 = {};
    stru1 = anacardConfig["Structure"];
    t_type = "Analytical";

    let st1 = t_type + "_" + ID + "_" + key + mycard["cardID"];
    outStru[st1] = { ...stru1 };
    stru1 = {};
    return outStru;
  },
  stackedcolumnCard: async function (
    mycard,
    appData1,
    outStru,
    appconfig1,
    ID,
    key
  ) {
    let j_number = 10;
    let trend1 = "Down";
    let state1 = "Error";
    let details1 = "2019-2020";
    let cardConfigFile1 = "../cards/cardConfig/" + mycard["template"];
    var anacardConfig = require(cardConfigFile1);
    head1 = {};
    head1 = { ...anacardConfig["Structure"]["sap.card"].header };
    json1 = {
      ...anacardConfig["Structure"]["sap.card"].content.data.json,
    };
    head1["title"] = appconfig1["title"];
    js1 = {};
    js1 = { ...anacardConfig["Structure"]["sap.card"].header.data.json };
    js1["number"] = j_number;
    js1["trend"] = trend1;
    js1["state"] = state1;
    js1["unit"] = appconfig1["unitOfMeasurement"];
    anacardConfig["Structure"]["sap.card"].content.data.json.list = list1;
    head1["data"]["json"] = { ...js1 };
    js1 = {};
    anacardConfig["Structure"]["sap.card"].header = { ...head1 };
    list1 = [];
    json1 = {};
    head1 = {};
    stru1 = anacardConfig["Structure"];
    t_type = "Analytical";

    let st1 = t_type + "_" + ID + "_" + key + mycard["cardID"];
    outStru[st1] = { ...stru1 };
    stru1 = {};

    return outStru;
  },
  generatePdfCertificate: async function (getData) {
    console.log("CertData2:", getData);
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
              console.log(config1.Controls.Filters[x][key]);
              console.log(ivalue);
              for (let y = 0; y < ivalue.length; y++) {
                for (const key in ivalue[y]) {
                  console.log(ivalue[y]["Field"]);
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

    console.log("Filters:", reqQuery1);
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
