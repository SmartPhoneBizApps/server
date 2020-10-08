const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  processingLog,
  tableValidate,
  findOneAppData,
  findOneUpdateData,
} = require("../../modules/config");
const App = require("../../models/appSetup/App");
const sendEmail = require("../../utils/sendEmail");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.addHCP = asyncHandler(async (req, res, next) => {
  console.log("Function - utilities/addHCP");

  // From App
  appX = await App.findOne({ applicationID: req.params.fromApp });
  if (!appX) {
    res.status(400).json({
      success: true,
      message: "1st applicationID is incorrect",
    });
  }

  // Read Config File
  configData = getNewConfig(req.params.toApp, req.params.role);
  let myData = await findOneAppData(req.params.ID, req.params.toApp);
  if (!myData) {
    return next(new ErrorResponse(`Record with ${req.body.ID} Not found`, 400));
  }

  mytrain = {};
  mytr = [];
  mytrain["ItemNumber"] = Math.floor(100 + Math.random() * 900);

  for (let q = 0; q < configData["DButtons"].length; q++) {
    for (const ky in configData["DButtons"][q]["FieldMapping"]) {
      const ex = configData["DButtons"][q]["FieldMapping"][ky];
      //   if (ex == ky) {
      if (req.body[ex] != undefined) {
        mytrain[ky] = req.body[ex];
        console.log("Key: ", ky, "/", ex, mytrain[ky], req.body[ex]);
      }
      console.log("Key: ", ky, "/", ex, mytrain[ky]);

      //   }
    }
  }

  mytr.push(mytrain);
  myData[req.params.table] = tableValidate(mytr, myData[req.params.table]);

  // Processing Log
  let Status = "NoChange";
  myData["TransLog"] = processingLog(
    req.params.ID,
    "NEW_RECORD",
    req.user.id,
    req.user.name,
    Status,
    req.params.toApp,
    "An assingment done",
    req.headers.buttontype,
    req.headers.buttonname
  );
  // console.log(req.params.toApp, myData);
  result = await findOneUpdateData(myData, req.params.toApp);
  console.log(result);
  if (result) {
    res.status(201).json({
      success: true,
      data: result,
      message: "Assingment Done",
    });
  } else {
    res.status(400).json({
      success: false,
      data: result,
      message: "Assingment error occured",
    });
  }
});