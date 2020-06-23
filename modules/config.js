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

  getInitialValues: function (a, b, c) {
    var set1 = new Set([]);
    let rl = "Role_" + b;
    let fn1 = "../NewConfig/initialValues_EN.json";
    var result = require(fn1);
    rl1 = {};
    let el1 = {};
    let kys = [];
    let out = [];
    let out1 = {};
    let res = [];
    for (const key in c) {
      kys.push(key);
      if (key == rl) {
        el1 = c[key];
      }
    }
    // Initial values
    for (let i = 0; i < result.initialValues.length; i++) {
      const element = result.initialValues[i];
      if (element["ApplicationID"] == a) {
        res = element["initialValues"];
        break;
      }
    }
    // User default
    for (const key in el1) {
      const element = el1[key];
      // Add User Defaults...
      out1["Field"] = key;
      out1["Value"] = el1[key];
      out1["EditLock"] = "No";
      for (let index = 0; index < res.length; index++) {
        if (res[index]["Field"] == key) {
          if (res[index]["EditLock"] == "Yes") {
            // Use initial values if EditLock is set ...
            out1["Field"] = key;
            out1["Value"] = res[index]["Value"];
            out1["EditLock"] = "Yes";
          }
        }
      }
      // Append the data in array ...
      out.push(out1);
      set1.add(out1);
      out1 = {};
    }
    // Add Initial values which are not in User Defaults...
    for (let index = 0; index < res.length; index++) {
      out1 = {};
      if (!(res[index]["Field"] in kys)) {
        out1 = { ...res[index] };
        out.push(out1);
        set1.add(out1);
      }
    }

    // Remove Duplicates...
    var resArr = [];
    out.forEach(function (item) {
      var i = resArr.findIndex((x) => x.Field == item.Field);
      if (i <= -1) {
        resArr.push({
          Field: item.Field,
          Value: item.Value,
          EditLock: item.EditLock,
        });
      }
    });

    return resArr;
  },

  getDateValues: function (a) {
    switch (a) {
      case "@currentDate":
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "today":
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@tomorrow":
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "tomorrow":
        var today = new Date();
        today.setDate(today.getDate() + 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@yesterday":
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "yesterday":
        var today = new Date();
        today.setDate(today.getDate() - 1);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@weekBack":
        var today = new Date();
        today.setDate(today.getDate() - 7);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@weekLater":
        var today = new Date();
        today.setDate(today.getDate() + 7);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@30DaysLater":
        var today = new Date();
        today.setDate(today.getDate() + 30);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@30DaysEarlier":
        var today = new Date();
        today.setDate(today.getDate() + 30);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@15DaysLater":
        var today = new Date();
        today.setDate(today.getDate() + 15);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      case "@15DaysEarlier":
        var today = new Date();
        today.setDate(today.getDate() + 15);
        var dd = String(today.getDate()).padStart(2, "0");
        var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
        var yyyy = today.getFullYear();
        date = yyyy + "-" + mm + "-" + dd;
        break;
      default:
        date = a;
        break;
    }
    return date;
  },

  getNewConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let fn = "../NewConfig/" + a + "_" + b + "_config.json";
    var result = require(fn);
    return result;
  },
  checkItemData: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let fn = "../NewConfig/" + a + "_" + b + "_config.json";
    var result1 = require(fn);
    var result = result1["itemData"];
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
    let kys = [];
    let out1 = {};
    var set1 = new Set([]);

    for (let i = 0; i < newitemData.length; i++) {
      kys.push(newitemData[i]["ItemNumber"]);
    }
    for (let x = 0; x < itmData.length; x++) {
      out1 = {};
      if (!kys.includes(itmData[x]["ItemNumber"])) {
        out1 = { ...itmData[x] };
        newitemData.push(out1);
        set1.add(out1);
      }
    }

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
  tableValidate: function (itmData, newitemData) {
    let kys = [];
    let out1 = {};
    var set1 = new Set([]);

    for (let i = 0; i < newitemData.length; i++) {
      kys.push(newitemData[i]["ItemNumber"]);
    }
    console.log(kys);
    for (let x = 0; x < itmData.length; x++) {
      out1 = {};
      if (!kys.includes(itmData[x]["ItemNumber"])) {
        console.log("Add Item");
        out1 = { ...itmData[x] };
        newitemData.push(out1);
        set1.add(out1);
      }
    }

    let itms = [];
    ItemFields = {};
    for (let db2 = 0; db2 < newitemData.length; db2++) {
      for (let b2 = 0; b2 < itmData.length; b2++) {
        if (itmData[b2]["ItemNumber"] == newitemData[db2]["ItemNumber"]) {
          console.log("Update Item");
          for (const b3 in itmData[b2]) {
            newitemData[db2][b3] = itmData[b2][b3];
          }
        }
      }
    }
    return newitemData;
  },

  handleArray: function (newData, oldData) {
    let current = [];
    let docID = newData["documentId"];
    current.push(newData);
    for (let index = 0; index < oldData.length; index++) {
      if (oldData[index]["documentId"] == docID) {
      } else {
        console.log("OldID-NM", oldData[index]["documentId"]);
        current.push(oldData[index]);
      }
    }
    return current;
  },
  getApplication: function (app) {
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
  // Business Application Modules....
  findOneAppDatabyid: function (TransID, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
    result = Model.findById(TransID);
    return result;
  },
  findOneUpdateData: function (mdata, app) {
    let path = "../models/smartApp/" + app;
    const Model = require(path);
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
  tableFields: function (FieldDef) {
    myFieldArray = [];
    for (let index = 0; index < FieldDef.length; index++) {
      if (FieldDef[index].type == "Array") {
        console.log(FieldDef[index].name);
        myFieldArray.push(FieldDef[index].name);
      }
    }
    return myFieldArray;
  },
  getAdaptiveCard: function (appID, role) {
    card = {};
    cardSub1 = {};
    header = {};
    content = {};
    actions = {};
    body = {};
    icon = {};

    let path1 = "../cards/adaptivecardforms/" + appID + "_" + role + ".json";
    let path2 =
      "../cards/adaptivecardforms/" + appID + "_" + role + "_actions.json";
    const cardbody = require(path1);
    const cardaction = require(path2);

    card["sap.app"] = {
      type: "card",
      id: "smartphoneapps",
    };
    card["cardMinRows"] = 4;
    card["cardColumn"] = 4;
    header["title"] = "Create Record";
    header["subTitle"] = "Create Form";
    if (appID == "BUS0000001") {
      header["title"] = "IT Service Ticket";
      header["subTitle"] = "Request IT Service Ticket";
    }
    if (appID == "BUS0000002") {
      header["title"] = "Flight Booking";
      header["subTitle"] = "Request Flight Booking";
    }
    if (appID == "BUS0000003") {
      header["title"] = "Taxi Booking";
      header["subTitle"] = "Request Online Taxi Booking";
    }
    if (appID == "BUS0000004") {
      header["title"] = "Train Booking";
      header["subTitle"] = "Request Train Booking";
    }
    if (appID == "BUS0000005") {
      header["title"] = "Contact Us";
      header["subTitle"] = "Contact Us";
    }
    if (appID == "BUS0000006") {
      header["title"] = "Employee Complaint";
      header["subTitle"] = "Employee Complaint";
    }
    if (appID == "EMPACC01") {
      header["title"] = "Laptop Requests";
      header["subTitle"] = "New Laptop Request ";
    }
    if (appID == "EMPBOK01") {
      header["title"] = "Employee Bookings";
      header["subTitle"] = "Meeting Room Booking";
    }
    icon["src"] = "sap-icon://form";
    header["icon"] = icon;
    cardSub1["header"] = header;

    cardSub1["type"] = "AdaptiveCard";

    content["$schema"] = "http://adaptivecards.io/schemas/adaptive-card.json";
    content["type"] = "AdaptiveCard";
    content["version"] = "1.0";
    content["body"] = cardbody["body"];
    content["actions"] = cardaction["actions"];
    cardSub1["content"] = content;

    card["sap.card"] = cardSub1;
    return card;
  },
};
