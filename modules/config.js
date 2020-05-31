const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
const ErrorResponse = require("../utils/errorResponse");
var button = require("../bot/Supplier_button.json");
const Agent = require("../models/access/Agent");
const App = require("../models/appSetup/App");
const Role = require("../models/appSetup/Role");
const User = require("../models/access/User");

module.exports = {
  getCreateMap: function (sapp, tapp, trans) {
    // Read Create Map Config
    // This will be used only when you create record copying data from sapp to tapp
    let fn =
      "../NewConfig/" + sapp + "_" + tapp + "_" + trans + "_createmap.json";
    var result = require(fn);
    return result;
  },
  getNewConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let fn = "../NewConfig/" + a + "_" + b + "_config.json";
    var result = require(fn);
    return result;
  },
  getPVConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp

    /*     const newPv = "../PossibleValues/" + a + "_" + b + "_pv.json";
    var pvconfig1 = require(newPv);
    return pvconfig1; */

    const newPv = "../NewConfig/" + a + "_" + b + "_config.json";
    var pvconfig1 = require(newPv);
    return pvconfig1["PossibleValues"];
  },
  getPVQuery: function (a, b, c) {
    app1 = a;
    app2 = "GLOBAL";
    role1 = b;
    role2 = "ALL";
    const fields = "PossibleValues Value Description ColorSAP Score EditLock";
    let query;
    query = Possval.find(
      {
        PossibleValues: { $in: c },
        ApplicationID: { $in: [app1, app2] },
        Role: { $in: [role1, role2] },
      },
      { _id: 0 }
    );
    query = query.select(fields);
    return query;
  },
  getButtonData: function (results, app, role1) {
    buttonData = {};
    // buttonVal = {};
    if (app == "SUPP00028" || app == "SUPP00018") {
      results.forEach((element) => {
        if (element.PossibleValues == "CurrentStatus") {
          for (const key in button[app][element.Value]) {
            if (button[app][element.Value].hasOwnProperty(key)) {
              const element1 = button[app][element.Value][key];
              if (key == role1) {
                buttonData[element.Value] = element1;
              } else if (key == "ALL") {
                buttonData[element.Value] = element1;
              }
            }
          }
        }
        //      l1 = {};
      });
    } else {
      results.forEach((element) => {
        if (element.PossibleValues == "Status") {
          for (const key in button[app][element.Value]) {
            if (button[app][element.Value].hasOwnProperty(key)) {
              const element1 = button[app][element.Value][key];
              if (key == role1) {
                buttonData[element.Value] = element1;
              } else if (key == "ALL") {
                buttonData[element.Value] = element1;
              }
            }
          }
        }
        //      l1 = {};
      });
    }

    return buttonData;
  },
  getBotListFields: function (config1) {
    lf = [];
    if (config1["ListBOTFields"]["Title"]) {
      config1["ListBOTFields"]["Title"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["SubTitle"]) {
      config1["ListBOTFields"]["SubTitle"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["Description"]) {
      config1["ListBOTFields"]["Description"].forEach((element1) => {
        lf.push(element1);
      });
    }
    if (config1["ListBOTFields"]["None"]) {
      config1["ListBOTFields"]["None"].forEach((element1) => {
        lf.push(element1);
      });
    }

    return lf;
  },
  createRefSetBody: function (result, app, user) {
    result.appId = app.id;
    result.applicationId = app.applicationID;
    result.user = user.id;
    result.userName = user.name;
    result.userEmail = user.email;
    result.company = user.company;
    result.branch = user.branch;
    result.area = user.area;
    return result;
  },

  itemValidate: function (itmData, newitemData) {
    let itms = [];
    ItemFields = {};
    for (let db2 = 0; db2 < newitemData.length; db2++) {
      for (let b2 = 0; b2 < itmData.length; b2++) {
        if (itmData[b2]["ItemNumber"] == newitemData[db2]["ItemNumber"]) {
          for (const b3 in itmData[b2]) {
            newitemData[db2][b3] = itmData[b2][b3];
          }
        }
      }
    }
    return newitemData;
  },

  getCompany: function (app) {
    const myApp = App.findOne({ applicationID: app });
    return myApp;
  },
  getRole: function (role) {
    const myRole = Role.findOne({ role: role });
    return myRole;
  },

  createUser: function (input) {
    user = User.create(input);
    return user;
  },
  findOneAgent: function (input) {
    const agent = Agent.findOne({
      agent: input,
    });
    return agent;
  },
  findOneSocialmedia: function (input) {
    const smedia = Socialmedia.findOne({
      SocialMediaAccountID: input,
    });
    return smedia;
  },
  findOneRole: function (input) {
    const role = Role.findOne({
      role: input,
    });
    return role;
  },
  findOneApp: function (input) {
    const app = App.findOne({
      applicationID: input,
    });
    return app;
  },

  // Business Application Modules....
  findOneAppData: function (TransID, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findOne({
      ID: TransID,
    });
    return result;
  },
  findOneUpdateData: function (mdata, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    console.log("AG", mdata.id);
    result = Model.findOneAndUpdate({ ID: mdata.ID }, mdata, {
      new: true,
      runValidators: true,
    });
    return result;
  },
  createDocument: function (app, mydata) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.create(mydata);
    return result;
  },
  createMultipleDocument: function (app, mydata) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.insertMany(mydata);
    return result;
  },
  findAndUpdateItem: function (mdata, app) {
    let path = "../models/smartApp/" + app + "_Itm";
    const Model = require(path);
    for (let index = 0; index < mdata.length; index++) {
      result2 = Model.findOneAndUpdate(
        { ID: mdata.ID, ItemNumber: mdata[index]["ItemNumber"] },
        mdata[index],
        {
          new: true,
          runValidators: true,
        }
      );
    }
    return result;
  },

  collectExceptionFields: function (FieldDef) {
    myFieldArray = [];
    myPossValArray = [];
    pvalObj = {};
    pvalArr = [];
    for (let index = 0; index < FieldDef.length; index++) {
      const element1 = FieldDef[index].name;
      myFieldArray.push(element1);
    }
    exclude_array = [
      "appId",
      "applicationId",
      "user",
      "userName",
      "userEmail",
      "company",
      "companyName",
      "branch",
      "branchName",
      "area",
      "areaName",
      "ItemData",
      "TransLog",
    ];
    myFieldArray.push.apply(myFieldArray, exclude_array);
    return myFieldArray;
  },
};
