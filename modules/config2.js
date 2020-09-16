const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
//const ErrorResponse = require("../utils/errorResponse");
//var button = require("../bot/Supplier_button.json");
const Agent = require("../models/access/Agent");
const App = require("../models/appSetup/App");
const Role = require("../models/appSetup/Role");
const User = require("../models/access/User");
const {
  getBotListFields,
  getInitialValues,
  buildButtons,
  getNewConfig,
} = require("./config");
const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const readFile = utils.promisify(fs.readFile);
const sendEmail = require("../utils/sendEmail");
const sendEmail1 = require("../utils/sendEmailProd");
var request = require("request");
module.exports = {
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
  notifiyMessanger: async function (a, b, c, d, e, f) {
    let path = "../models/access/" + "Socialmedia";
    const Model = require(path);
    SM1 = Model.findOne({ email: a, SocialMediaType: e });
    SM = await SM1;
    console.log(SM);
    URL =
      "https://fbnotificationbot.herokuapp.com/?userFBID=" +
      SM["SocialMediaAccountID"] +
      "&role=" +
      b +
      "&message=" +
      c +
      "&messageType=" +
      d +
      "&token=" +
      f;
    console.log(URL);
    var options = {
      method: "POST",
      url: URL,
    };

    request.post(options, function (error, response, body) {
      if (error) throw new Error(error);
      console.log("Notification sent", error);
    });
    //  "https://fbnotificationbot.herokuapp.com/?userFBID=1805665356118639&role=Employee&message=Your%20record%20created%20successfully...&messageType=Text",

    cKey = d + a.substring(0, 3) + a.slice(-2) + b.substring(0, 3) + c;
    return true;
  },

  getTotalCount: function (app, req, config1) {
    //   let config = {};
    fl1 = {};
    fl2 = [];
    //    let app2;
    let model2;

    // Get Table Schema
    let path = "../models/smartApp/" + app;
    const model = require(path);
    console.log("X1", path);

    // if (config1["itemData"] == "Yes") {
    //   app2 = app + "_Itm";
    //   let path = "../models/smartApp/" + app2;
    //   model2 = require(path);
    // } else {
    //   model2 = model;
    // }
    model2 = model;
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
          console.log("X1", key);
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

    for (const k1 in req.query) {
      if (req.query.hasOwnProperty(k1)) {
        var res = req.query[k1].split("|");
        if (res.length > 1) {
          tx = {};
          tx["in"] = res;
          reqQuery1[k1] = tx;
        } else {
          reqQuery1[k1] = res[0];
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
      console.log(key);
      //  var n = key.includes("ItemData");
      // if ((n == true) & (model !== model2)) {
      //   const fList = key.split("_");
      //   reqQuery2[fList[1]] = reqQuery1[key];
      //   var r1 = reqQuery1[key].includes("ne"); // Add the logic for gt, lt etc...
      //   if (r1 == true) {
      //     rg01 = reqQuery1[key].split("|");
      //     rn[rg01[0]] = rg01[1];
      //     reqQuery2[fList[1]] = rn;
      //   }
      //   } else {
      reqQuery[key] = reqQuery1[key];
      //    }
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
      console.log(lf);
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
    for (const k1 in req.query) {
      if (req.query.hasOwnProperty(k1)) {
        var res = req.query[k1].split("|");
        if (res.length > 1) {
          tx = {};
          tx["in"] = res;
          reqQuery1[k1] = tx;
        } else {
          reqQuery1[k1] = res[0];
        }
      }
    }
    console.log("Query", reqQuery1);
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
      /\b(gt|gte|lt|lte|in|regex|options)\b/g,
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
  getButtonData: function (results, app, role1, oData, user, appRoles) {
    console.log("------------------------------------------------------------");
    console.log(" --------   B U T T O N S   --   L O G I C  ----------------");
    console.log("------------------------------------------------------------");
    // Get Config File
    var appconfig = getNewConfig(app, role1);

    // Get Action Variable
    action_var =
      role1.substring(0, 3) +
      "_" +
      app.substring(0, 3) +
      "_" +
      app.slice(app.length - 3);
    var action_var = action_var.toUpperCase();

    // Build Buttons...

    console.log(action_var, "RecordID", oData["ID"]);
    b_display = buildButtons(
      "web_url",
      "Display",
      app,
      role1,
      oData["_id"],
      user["email"],
      "compact",
      "display"
    );
    b_create = buildButtons(
      "web_url",
      "Create",
      app,
      role1,
      oData["_id"],
      user["email"],
      "compact",
      "create"
    );

    buttonData1 = {};
    btnx = {};
    btn1 = [];
    var button1 = {};

    // If data record exists..
    if (oData != undefined) {
      // Current Status Value(Example - Submitted)
      currentStatus = oData["Status"];

      // Find Current Score(Example - 200)
      currentScore = 0;
      for (let k = 0; k < results.length; k++) {
        if (
          results[k]["Value"] == currentStatus &&
          results[k]["Role"] == role1
        ) {
          currentScore = results[k]["Score"];
        }
      }
      console.log(
        "CurrentStatus = ",
        currentStatus,
        "CurrentScore = ",
        currentScore
      );

      // Add display button (for all Roles and Status Display button will be there)
      btn1.push(b_display);

      // If create is allowed then add cancel button
      for (let j = 0; j < appconfig["DButtons"].length; j++) {
        agbtn = appconfig["DButtons"][j];
        if (agbtn["type"] == "WORKFLOW") {
          for (let k = 0; k < agbtn["transferFields"].length; k++) {
            if (agbtn["transferFields"][k]["field"] == "Status") {
              results.forEach((element) => {
                if (
                  element.PossibleValues == "Status" &&
                  element.Score >= currentScore &&
                  element.Value == agbtn["transferFields"][k]["value"] &&
                  element.Role == role1
                ) {
                  if (element.Value != currentStatus) {
                    console.log(
                      currentStatus,
                      "-",
                      currentScore,
                      ">",
                      element.Value,
                      "-",
                      element.Score,
                      ">",
                      k,
                      "-",
                      element.Role,
                      "> Button Created"
                    );
                    btnx["type"] = "postBack";
                    btnx["title"] = agbtn["name"];
                    btnx["payload"] =
                      action_var + "-" + agbtn["name"] + " " + oData["ID"];
                    btn1.push({ ...btnx });
                    btnx = {};
                  } else {
                    console.log(
                      currentStatus,
                      "-",
                      currentScore,
                      ">",
                      element.Value,
                      "-",
                      element.Score,
                      ">",
                      k,
                      "-",
                      element.Role,
                      "> Button Not Created"
                    );
                  }
                }
              });
            }
          }
        }
      }
      buttonData1[currentStatus] = btn1;
      button1[currentStatus] = buttonData1;
      btn1 = [];
    }
    return buttonData1;
  },
};
