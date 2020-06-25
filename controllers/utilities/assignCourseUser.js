const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
} = require("../../modules/config");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
const sendEmail = require("../../utils/sendEmail");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.assignCourseUser = asyncHandler(async (req, res, next) => {
  userX = await User.findOne({ email: req.params.user });
  if (!userX) {
    res.status(400).json({
      success: true,
      message: "EmailID is not setup as user, course can't be assigned",
    });
  }
  appX = await App.findOne({ applicationID: req.params.toApp });
  if (!appX) {
    res.status(400).json({
      success: true,
      message: "2nd applicationID is incorrect",
    });
  }

  console.log(appX);

  console.log(req.params.fromApp);
  console.log(req.params.toApp);
  console.log(req.params.ID);
  console.log(req.params.user);
  out1 = {};
  Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Course ID not found",
    });
  }

  console.log("Appdata", Appdata);
  configData = getNewConfig(req.params.toApp, "Employee");
  for (let i = 0; i < configData.FieldDef.length; i++) {
    const el1 = configData.FieldDef[i];
    console.log(el1.name);
    for (const key in Appdata) {
      const element = Appdata[key];
      if (key == el1.name) {
        console.log("Appdata", el1.name, element);
        out1[key] = element;
      }
    }
  }

  // console.log(Appdata);
  //Appdata.id = "";
  console.log(appX.id);
  out1["appId"] = appX.id;
  out1["user"] = userX.id;
  out1["userName"] = userX.userName;
  out1["userEmail"] = userX.email;
  out1["company"] = userX.company;
  out1["branch"] = userX.branch;
  out1["area"] = userX.area;

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
