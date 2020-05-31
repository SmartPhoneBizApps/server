// Read Card Configuration for the Role (X1)
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");
const fs = require("fs");

// @desc      Get getPossVal
// @route     GET /api/v1/getPossVal
// @route     GET /api/v1/getPossVal
// @access    Public
exports.getPossVal = asyncHandler(async (req, res, next) => {
  app1 = req.params.applicationID;
  app2 = "GLOBAL";
  role1 = req.params.Role;
  role2 = "ALL";

  let query;

  query = Possval.find(
    {
      PossibleValues: req.params.PossibleValues,
      ApplicationID: { $in: [app1, app2] },
      Role: { $in: [role1, role2] },
    },
    { _id: 0 }
  );

  const fields = "Value Description ColorSAP Score EditLock";
  query = query.select(fields);

  // Executing query
  const results = await query;

  return res.status(200).json({
    success: true,
    data: results,
  });
});

// @desc      Get getPossVal
// @route     POST /api/v1/getPossVal
// @route     GET /api/v1/getPossVal
// @access    Public
exports.addPossValFile = asyncHandler(async (req, res, next) => {
  // let fn4 = "../../utils/csvjson.json";
  // var possVal = require(fn4);
  req.headers.applicationid;

  let fn5 = "../../applicationJSON/" + req.headers.applicationid + ".json";
  let mp =
    "/Users/atulgupta/Downloads/smartApp/applicationJSON/" +
    req.headers.applicationid +
    ".json";

  var pVal = require(fn5);
  app1 = req.headers.applicationid;
  app2 = "GLOBAL";
  role1 = req.headers.Role;
  role2 = "ALL";
  pVal1 = "Status";

  let query;

  query = Possval.find(
    {
      PossibleValues: pVal1,
      ApplicationID: { $in: [app1, app2] },
      //    Role: { $in: [role1, role2] },
    },
    { _id: 0 }
  );

  const fields = "Value";
  query = query.select(fields);

  // Executing query
  const results = await query;
  results1 = [new Set(results)];
  myPVal = [];
  results1.forEach((element) => {
    myPVal.push(element["Value"]);
  });

  pVal[pVal1]["enum"] = myPVal;
  newfile = JSON.stringify(pVal);

  fs.writeFile(mp, newfile, (err) => {
    if (err) {
      console.log("Error writing file", err);
    } else {
      console.log("Successfully wrote file");
    }
  });
  myPVal = [];
  newfile = [];
  res.status(200).json({
    success: true,
  });
});
