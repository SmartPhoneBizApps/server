const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
  getNewCopyRecord,
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
  Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Course ID not found",
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
