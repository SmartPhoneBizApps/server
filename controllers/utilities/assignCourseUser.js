const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const {
  getNewConfig,
  findOneAppData,
  createDocument,
} = require("../../modules/config");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.assignCourseUser = asyncHandler(async (req, res, next) => {
  userX = await User.findOne({ email: req.params.user });
  appX = await App.findOne({ applicationID: req.params.toApp });

  console.log(appX);

  console.log(req.params.fromApp);
  console.log(req.params.toApp);
  console.log(req.params.ID);
  console.log(req.params.user);
  out1 = {};
  Appdata = await findOneAppData(req.params.ID, req.params.fromApp);
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

  res.status(201).json({
    success: true,
    data: result,
    message: "Course assigned to the user",
  });
});
