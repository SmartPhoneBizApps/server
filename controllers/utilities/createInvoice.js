const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocumentAPI,
  getNewCopyRecord,
  getDateValues,
  findOneAppDataRefID,
} = require("../../modules/config");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
const sendEmail = require("../../utils/sendEmail");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.createInvoice = asyncHandler(async (req, res, next) => {
  console.log("Function - utilities/createInvoice");
  console.log("From App", req.params.fromApp);
  console.log("To App", req.params.toApp);
  console.log("From Role", req.params.sourceRole);
  console.log("To Role", req.params.targetRole);
  console.log("User Email", req.params.user);

  fromApp = req.params.fromApp;
  targetRole = req.params.targetRole;
  authorization = req.headers.authorization;

  out1 = {};
  Appdata = {};
  let results1 = [];

  // Read Config File
  configData = getNewConfig(req.params.toApp, req.params.targetRole);
  configFrom = getNewConfig(req.params.fromApp, req.params.sourceRole);
  pflow_upper = configFrom["Controls"]["processflow"]["config"];
  pflow_lower = configData["Controls"]["processflow"]["config"];

  // Find User
  userX = await User.findOne({ email: req.params.user });
  // Find App
  appX = await App.findOne({ applicationID: req.params.fromApp });

  // If Data Source is mongoDB
  if (configFrom["Controls"]["Source"]["SourceName"] == "mongoDB") {
    // Search Document from Ref Number or ID
    if (configFrom["Controls"]["Source"]["documentKey"] == "ReferenceID") {
      Appdata = await findOneAppDataRefID(req.params.ID, req.params.fromApp);
    } else {
      Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
    }

    if (!Appdata) {
      res.status(400).json({
        success: true,
        message: "Record not found",
      });
    }
    // Assign mapping values...
    for (let x = 0; x < Appdata.length; x++) {
      if (Appdata[x]["id"] == req.params.ID) {
        x1 = configFrom["Controls"]["Source"]["FieldMapping"];
        for (let y = 0; y < x1.length; y++) {
          const e2 = x1[y];
          for (const k3 in e2) {
            Appdata[k3] = Appdata[x][e2[k3]];
          }
        }
      }
    }
  }
  // If Data Source is JSON
  if (configFrom["Controls"]["Source"]["SourceName"] == "jsonData") {
    let fn = "../.." + configFrom["Controls"]["Source"]["SourceFile"];
    results1 = require(fn);
    i_temp = [];
    // Assign mapping values...
    for (let x = 0; x < results1["courses"].length; x++) {
      if (results1["courses"][x]["id"] == req.params.ID) {
        x1 = configFrom["Controls"]["Source"]["FieldMapping"];
        for (let y = 0; y < x1.length; y++) {
          const e2 = x1[y];
          for (const k3 in e2) {
            if (k3 == "Image") {
              i_temp.push(results1["courses"][x][e2[k3]]);
              Appdata[k3] = i_temp;
            } else {
              Appdata[k3] = results1["courses"][x][e2[k3]];
            }
          }
        }
      }
    }
  }
  // Assign Fixed values...(Both mongoDB / JSON)
  x2 = configFrom["Controls"]["Source"]["FixedValues"];
  if (x2 != undefined) {
    for (let y = 0; y < x2.length; y++) {
      const e2 = x2[y];
      for (const k3 in e2) {
        e2[k3] = getDateValues(e2[k3]);
        Appdata[k3] = e2[k3];
      }
    }
  }
  // Assign MasterData values...(Both mongoDB / JSON)
  if (configFrom["Controls"]["Source"].hasOwnProperty("MasterData")) {
    m1 = configFrom["Controls"]["Source"]["MasterData"];
    if (m1 != undefined) {
      for (let y = 0; y < m1.length; y++) {
        const m2 = m1[y];
        table = m2["Table"];
        masterdata = await findOneAppData(req.params.ID, table);
        CopyFields = m2["CopyFields"];
      }
    }
  }

  // Create a copy of record
  out1 = getNewCopyRecord(
    configData,
    Appdata,
    req.params.ID,
    userX,
    appX.id,
    req.params.fromApp,
    req.params.toApp
  );

  out1["upperNodes"] = [];
  uNode = {};
  uNode = Appdata["selfNode"][0];
  // uNode["texts"] = [];
  // uNode["id"] = Appdata["ID"];
  // uNode["fromApp"] = req.params.fromApp;
  // uNode["lane"] = pflow_upper["fieldMap"]["lane"];
  // uNode["title"] = pflow_upper["fieldMap"]["title"].replace(
  //   "@ID",
  //   Appdata["ID"]
  // );
  // uNode["titleAbbreviation"] = pflow_upper["fieldMap"]["titleAbbreviation"];
  // uNode["state"] = pflow_upper["fieldMap"]["state"];
  // uNode["stateText"] = pflow_upper["fieldMap"]["stateText"];
  // uNode["focused"] = pflow_upper["fieldMap"]["focused"];
  // uNode["highlighted"] = pflow_upper["fieldMap"]["highlighted"];
  // uNode["texts"].push(pflow_upper["fieldMap"]["text1"]);
  // uNode["texts"].push(pflow_upper["fieldMap"]["text2"]);
  // uNode["quickView"] = Appdata["fieldMap"]["quickView"];
  // uNode["children"] = [];
  out1["upperNodes"].push({ ...uNode });
  out1["lowerNodes"] = [];
  uNode = {};

  // Create the new copied document...
  result = await createDocumentAPI(
    req.params.toApp,
    req.params.targetRole,
    "Yes",
    "Messenger",
    out1,
    req.headers.authorization,
    "POST",
    "ADD",
    "Create with Reference",
    "Create",
    "External"
  );
  // Update Master document...
  Out2 = {};
  Out2["ID"] = req.params.ID;
  if (configFrom["Controls"].hasOwnProperty("Source")) {
    if (configFrom["Controls"]["Source"].hasOwnProperty("sourceTableUpdate")) {
      if (configFrom["Controls"]["Source"]["sourceTableUpdate"].length > 0) {
        for (
          let j = 0;
          j < configFrom["Controls"]["Source"]["sourceTableUpdate"].length;
          j++
        ) {
          tab1 = configFrom["Controls"]["Source"]["sourceTableUpdate"][j];
          o2 = {};
          o2x = [];
          items2u = [];
          for (const kk in tab1) {
            if (out1.hasOwnProperty(kk)) {
              for (let d = 0; d < out1[kk].length; d++) {
                items2u.push(out1[kk][d]["ItemNumber"]);
              }
            }
            for (let i = 0; i < tab1[kk].length; i++) {
              for (const ki in tab1[kk][i]) {
                o2[ki] = tab1[kk][i][ki];
                items2u.forEach((ew) => {
                  o2["ItemNumber"] = ew;
                  o2x.push({ ...o2 });
                });
              }
            }
            Out2[kk] = o2x;
            o2x = [];
          }
        }
      }
    }
  }

  setTimeout(function () {
    // New Invoice document
    console.log("Result of Invoice Create : ", result);
    // Set Process Flow for Source document..
    if (Out2["lowerNodes"] == undefined) {
      Out2["lowerNodes"] = [];
    }
    lNode = {};
    lNode["texts"] = [];
    lNode = result["body"]["data"]["selfNode"][0];

    // lNode["id"] = result["body"]["data"]["ID"];
    // lNode["toApp"] = req.params.toApp;
    // lNode["lane"] = pflow_lower["fieldMap"]["lane"];
    // lNode["title"] = pflow_lower["fieldMap"]["title"].replace(
    //   "@ID",
    //   result["body"]["data"]["ID"]
    // );
    // lNode["titleAbbreviation"] = pflow_lower["fieldMap"]["titleAbbreviation"];
    // lNode["state"] = pflow_lower["fieldMap"]["state"];
    // lNode["stateText"] = pflow_lower["fieldMap"]["stateText"];
    // lNode["focused"] = pflow_lower["fieldMap"]["focused"];
    // lNode["highlighted"] = pflow_lower["fieldMap"]["highlighted"];
    // lNode["texts"].push(pflow_lower["fieldMap"]["text1"]);
    // lNode["texts"].push(pflow_lower["fieldMap"]["text2"]);

    // var qView = JSON.stringify(pflow_lower["attributes"]);
    // for (let j = 0; j < configFrom["FieldDef"].length; j++) {
    //   repString = "@" + configFrom["FieldDef"][j]["name"];
    //   console.log(repString);
    //   qView = qView.replace(
    //     repString,
    //     Appdata[configFrom["FieldDef"][j]["name"]]
    //   );
    // }
    // lNode["quickView"] = JSON.parse(qView);
    // console.log(lNode["quickView"]);
    Out2["lowerNodes"].push({ ...lNode });
    lNode = {};

    // Update the existing Record ...
    result2 = createDocumentAPI(
      fromApp,
      targetRole,
      "Yes",
      "Messenger",
      Out2,
      authorization,
      "PUT",
      "UPDATE",
      "Update with Reference",
      "FieldUpdate",
      "External"
    );
  }, 5000);

  let message = "";
  message =
    "Hi " +
    userX.name +
    ", A new learning has been assigned to you for '" +
    Appdata.Group +
    "(" +
    Appdata.SubGroup +
    ")'. You need to complete this learning by " +
    Appdata.EndDate +
    ". Regards, Learning Team";

  let sub = "";
  sub = "New Learning on " + Appdata.Group;
  try {
    await sendEmail({
      email: req.params.user,
      subject: sub,
      message,
    });
    res.status(200).json({
      success: true,
      message: "Email sent",
      result: result,
    });
  } catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      message: "Email Can't be sent",
      result: result,
    });
  }
});
