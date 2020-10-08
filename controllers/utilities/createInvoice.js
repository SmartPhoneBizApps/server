const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
  createDocumentAPI,
  getNewCopyRecord,
  getDateValues,
  getInitialValues,
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

  // Read Config File
  configData = getNewConfig(req.params.toApp, req.params.targetRole);
  configFrom = getNewConfig(req.params.fromApp, req.params.sourceRole);

  // Validate inputs..
  userX = await User.findOne({ email: req.params.user });
  if (!userX) {
    res.status(400).json({
      success: true,
      message: "EmailID is not setup as user, document can't be assigned",
    });
  }
  appX = await App.findOne({ applicationID: req.params.fromApp });
  if (!appX) {
    res.status(400).json({
      success: true,
      message: "1st applicationID is incorrect",
    });
  }

  out1 = {};
  Appdata = {};
  let results1 = [];

  if (configFrom["Controls"]["Source"]["SourceName"] == "mongoDB") {
    // Search Document from Ref Number or ID
    if (configFrom["Controls"]["Source"]["documentKey"] == "ReferenceID") {
      Appdata = await findOneAppDataRefID(req.params.ID, req.params.fromApp);
    } else {
      Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
    }

    // Assign mapping values...
    for (let x = 0; x < Appdata.length; x++) {
      if (Appdata[x]["id"] == req.params.ID) {
        x1 = configFrom["Controls"]["Source"]["FieldMapping"];
        for (let y = 0; y < x1.length; y++) {
          const e2 = x1[y];
          for (const k3 in e2) {
            Appdata[k3] = Appdata[x][e2[k3]];
            console.log("Appdata[k3]", Appdata[k3]);
          }
        }
      }
    }
  }
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
            console.log(results1["courses"][x][e2[k3]]);
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

  // Assign Fixed values...
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
  // Assign MasterData values...

  if (configFrom["Controls"]["Source"].hasOwnProperty("MasterData")) {
    m1 = configFrom["Controls"]["Source"]["MasterData"];
    if (m1 != undefined) {
      for (let y = 0; y < m1.length; y++) {
        const m2 = m1[y];
        table = m2["Table"];
        masterdata = await findOneAppData(req.params.ID, table);
        CopyFields = m2["CopyFields"];
        // for (const m3 in m2) {
        //   m2[m3] = getDateValues(m2[m3]);
        //   Appdata[m3] = m2[m3];
        // }
      }
    }
  }

  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Record not found",
    });
  }
  out1 = getNewCopyRecord(configData, Appdata, req.params.ID, userX, appX.id);
  //result = await createDocument(req.params.toApp, out1);

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
    "Create"
  );

  if (configFrom["Controls"]["Source"]["sourceTableUpdate"].length > 0) {
    console.log("Source Field..");
    Out2 = {};
    Out2["ID"] = req.params.ID;
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
        console.log(kk, tab1[kk], out1);
        if (out1.hasOwnProperty(kk)) {
          for (let d = 0; d < out1[kk].length; d++) {
            console.log(out1[kk][d]["ItemNumber"]);
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
            console.log(
              "ItemData to be updated",
              kk,
              ki,
              tab1[kk][i][ki],
              items2u
            );
          }
        }
        Out2[kk] = o2x;
        o2x = [];
      }

      // Create the new copied document...
      result = await createDocumentAPI(
        req.params.fromApp,
        req.params.targetRole,
        "Yes",
        "Messenger",
        Out2,
        req.headers.authorization,
        "PUT",
        "UPDATE",
        "Update with Reference",
        "FieldUpdate"
      );

      console.log(req.params.fromApp, req.params.targetRole, Out2);
    }
  }
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
      message: "Record assigned to the user & Email sent",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: true,
      message: "Record assigned to the user but Email could not be sent",
    });
  }

  /*   res.status(201).json({
    success: true,
    data: result,
    message: "Course assigned to the user",
  }); */
});