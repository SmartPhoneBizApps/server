const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
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
exports.assignCourseUser = asyncHandler(async (req, res, next) => {
  console.log("Function - utilities/assignCourseUser");
  // Read Config File
  configData = getNewConfig(req.params.toApp, "EmployeeLearn");
  configFrom = getNewConfig(req.params.fromApp, req.params.role);

  /// Validations....
  userX = await User.findOne({ email: req.params.user });
  if (!userX) {
    res.status(400).json({
      success: true,
      message: "EmailID is not setup as user, course can't be assigned",
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

  if (configFrom["Controls"]["Source"]["SourceName"] == "mongoDB") {
    if (req.params.fromApp == "TRAIN008") {
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

  // Assign Fixed values...
  x2 = configFrom["Controls"]["Source"]["FixedValues"];
  for (let y = 0; y < x2.length; y++) {
    const e2 = x2[y];
    for (const k3 in e2) {
      e2[k3] = getDateValues(e2[k3]);
      Appdata[k3] = e2[k3];
    }
  }

  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Record not found",
    });
  }

  out1 = getNewCopyRecord(configData, Appdata, req.params.ID, userX, appX.id);
  result = await createDocument(req.params.toApp, out1);
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
