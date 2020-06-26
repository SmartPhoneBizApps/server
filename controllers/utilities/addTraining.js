const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppDataRefID,
  createDocument,
  getNewCopyRecord,
} = require("../../modules/config");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
const sendEmail = require("../../utils/sendEmail");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.addTraining = asyncHandler(async (req, res, next) => {
  /// Validations....
  console.log("Heelo");
  appX = await App.findOne({ applicationID: req.params.fromApp });
  if (!appX) {
    res.status(400).json({
      success: true,
      message: "1st applicationID is incorrect",
    });
  }
  out1 = {};
  Appdata = await findOneAppDataRefID(
    req.params.ReferenceID,
    req.params.fromApp
  );

  console.log(req.params.ReferenceID, req.params.fromApp);
  if (!Appdata) {
    res.status(400).json({
      success: true,
      message: "Course ID not found",
    });
  }
  newOut = {};
  // Read Config File

  configData = getNewConfig(req.params.toApp, req.params.role);
  console.log(
    configData["tableConfig"][req.params.table]["ItemFieldDefinition"]
  );
  for (let q = 0; q < configData["DButtons"].length; q++) {
    for (const key in configData["DButtons"][q]["Map"]) {
      if (configData["DButtons"][q]["Map"].hasOwnProperty(key)) {
        console.log(key, req.body[key]);
        const element = configData["DButtons"][q]["Map"][key];
        newOut[element] = req.body[key];
      }
    }
  }

  result = newOut;
  // result = await createDocument(req.params.toApp, out1);
  res.status(201).json({
    success: true,
    data: result,
    message: "Training Added",
  });
});
