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
exports.copyCourse = asyncHandler(async (req, res, next) => {
  console.log("Function - utilities/copyCourse(File : addCourseCatalog)");

  /// Validations....
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

  // Read Config File
  configData = getNewConfig(req.params.toApp, req.params.role);
  out1 = getNewCopyRecord(
    configData,
    Appdata,
    req.params.ID,
    req.user,
    appX.id
  );
  result = await createDocument(req.params.toApp, out1);

  res.status(201).json({
    success: true,
    data: result,
    message: "Record added",
  });
});
