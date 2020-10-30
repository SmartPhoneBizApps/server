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
  configFile = getNewConfig(req.params.toApp, req.params.role);
  let myData = await findOneAppData(req.params.ID, req.params.toApp);
  if (!myData) {
    return next(
      new ErrorResponse(`Record with ${req.params.ID} Not found`, 400)
    );
  }

  mytrain = {};
  mytr = [];
  mytrain["ItemNumber"] = Math.floor(100 + Math.random() * 900);

  for (let q = 0; q < configFile["DButtons"].length; q++) {
    for (const ky in configFile["DButtons"][q]["FieldMapping"]) {
      const ex = configFile["DButtons"][q]["FieldMapping"][ky];
      if (req.body[ex] != undefined) {
        mytrain[ky] = req.body[ex];
      }
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
    "HCP Assingment",
    req.headers.buttontype,
    req.headers.buttonname
  );

  // Perform Document Checks..
  chk = {};
  myData["checks"] = [];
  X1 = [];
  if (configFile["Checks"] != undefined) {
    for (let k = 0; k < configFile["Checks"]["Header"].length; k++) {
      fieldName = configFile["Checks"]["Header"][k]["Field"];
      fieldValue = configFile["Checks"]["Header"][k]["Value"];
      console.log("Checks..", fieldName, fieldValue);
      switch (configFile["Checks"]["Header"][k]["Operator"]) {
        case "EQ":
          console.log(fieldName, req.body[fieldName]);
          if (fieldValue == [] || fieldValue == "") {
            if (
              myData[fieldName] == fieldValue ||
              myData[fieldName] == undefined
            ) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          } else {
            if (myData[fieldName] == fieldValue) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          }
          break;
        case "COUNT":
          if (myData[fieldName] == undefined) {
            myData[fieldName] = [];
          } else {
            if (myData[fieldName].length == fieldValue) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          }
          break;
        default:
          X1 =
            "SETUP-FAIL-999-There is a Setup issue for (" +
            configFile["Checks"]["Header"][k]["Operator"] +
            ")";
          X1 = X1.split("-");
          break;
      }
      chk["Type"] = X1[0];
      chk["ItemStatus"] = X1[1];
      chk["Number"] = X1[2];
      chk["Message"] = X1[3];
      chk["checkDate"] = new Date();
      chk["checkStage"] = "Document Update";
      chk["buttonType"] = req.headers.buttontype;
      chk["buttonName"] = req.headers.buttonname;
      myData["checks"].push({ ...chk });
      chk = {};
      X1 = [];
    }
  }

  result = await findOneUpdateData(myData, req.params.toApp);
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
