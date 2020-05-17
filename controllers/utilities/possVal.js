// Read Card Configuration for the Role (X1)
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");

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
  let fn4 = "../../utils/csvjson.json";
  var possVal = require(fn4);
  console.log(possVal);
  for (var i = 0; i < possVal.length; i++) {
    var obj = possVal[i];
    // Uncomment to load the file
    // const pVal = await Possval.create(obj);
    console.log(obj);
    console.log("---------Uncomment to load the file ------------------");
  }
  res.status(200).json({
    success: true,
    data: possVal,
  });
});

/* exports.getPossVal = async (req, res, next) => {
  let fn1 = "../../utils/appList.json";
  var appList = require(fn1);

  let fn2 = "../../utils/AppRole.json";
  var appRole = require(fn2);

  let fn3 = "../../utils/AppRolePV.json";
  var AppRolePv = require(fn3);

  let fn4 = "../../utils/csvjson.json";
  var possVal = require(fn4);

  appList.forEach((element) => {
    mydata["ApplicationID"] = element;
    appRole.forEach((element1) => {
      if (element == appRole["ApplicationID"]) {
        appList["ApplicationID"]["Role"].push(appList["Role"]);
      }
    });

    console.log(element);
  });

  res.status(200).json({
    success: true,
    data: appList,
  });
}; */
