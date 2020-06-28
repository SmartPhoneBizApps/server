const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
  getNewCopyRecord,
  getDateValues,
  getInitialValues,
} = require("../../modules/config");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
const sendEmail = require("../../utils/sendEmail");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.assignCourseUser = asyncHandler(async (req, res, next) => {
  // Read Config File

  configData = getNewConfig(req.params.toApp, "EmployeeLearn");
  configFrom = getNewConfig(req.params.fromApp, "TrainingTeam");
  console.log("From", req.params.fromApp);
  console.log("To", req.params.toApp);
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

  /*   /// Initial values..
  var ivalue = getInitialValues(
    req.params.id,
    req.headers.businessrole,
    req.user
  );
  let ival_out = [];
  let ival = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  } */

  out1 = {};
  Appdata = {};
  console.log("Source", configFrom["Controls"]["Source"]["SourceName"]);
  if (configFrom["Controls"]["Source"]["SourceName"] == "jsonData") {
    let fn = "../.." + configFrom["Controls"]["Source"]["SourceFile"];
    var res1 = require(fn);
    for (let x = 0; x < res1["courses"].length; x++) {
      if (res1["courses"][x]["id"] == req.params.ID) {
        x1 = configFrom["Controls"]["Source"]["FieldMapping"];
        //    Appdata = res1["courses"][x];
        //
        for (let y = 0; y < x1.length; y++) {
          let t_image = [];
          const e2 = x1[y];
          for (const k3 in e2) {
            if (k3 == "Image") {
              t_image.push(res1["courses"][x][e2[k3]]);
              Appdata[k3] = t_image;
            } else {
              Appdata[k3] = res1["courses"][x][e2[k3]];
            }
          }
        }
      }
    }

    x2 = configFrom["Controls"]["Source"]["FixedValues"];
    //    Appdata = res1["courses"][x];
    for (let y = 0; y < x2.length; y++) {
      const e2 = x2[y];
      for (const k3 in e2) {
        e2[k3] = getDateValues(e2[k3]);
        Appdata[k3] = e2[k3];
      }
    }
  }

  if (configFrom["Controls"]["Source"]["SourceName"] == "mongoDB") {
    Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
  }

  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Course ID not found",
    });
  }
  console.log("Data for new Rec", Appdata);
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
      message: "Course assigned to the user & Email sent",
    });
  } catch (err) {
    console.log(err);
    res.status(200).json({
      success: true,
      message: "Course assigned to the user but Email could not be sent",
    });
  }

  /*   res.status(201).json({
    success: true,
    data: result,
    message: "Course assigned to the user",
  }); */
});
