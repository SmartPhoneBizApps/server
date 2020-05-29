const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
const { getNewConfig } = require("../../modules/config");
const calfunction = require("../../models/utilities/calfunction.js");
const Possval = require("../../models/appSetup/Possval");
const { getSchema } = require("../../modules/validations/schema");
const BUS0000002 = require("../../models/smartApp/BUS0000002");
const BUS0000003 = require("../../models/smartApp/BUS0000003");
const BUS0000004 = require("../../models/smartApp/BUS0000004");
const BUS0000005 = require("../../models/smartApp/BUS0000005");
const COUNCIL002 = require("../../models/smartApp/COUNCIL002");
const COUNCIL003 = require("../../models/smartApp/COUNCIL003");
const COUNCIL007 = require("../../models/smartApp/COUNCIL007");
const COUNCIL012 = require("../../models/smartApp/COUNCIL012");
const COUNCIL015 = require("../../models/smartApp/COUNCIL015");
const COUNCIL022 = require("../../models/smartApp/COUNCIL022");
const COUNCIL023 = require("../../models/smartApp/COUNCIL023");
const COUNCIL026 = require("../../models/smartApp/COUNCIL026");
const COUNCIL029 = require("../../models/smartApp/COUNCIL029");
const COUNCIL033 = require("../../models/smartApp/COUNCIL033");
const COUNCIL034 = require("../../models/smartApp/COUNCIL034");
const COUNCIL035 = require("../../models/smartApp/COUNCIL035");
const COUNCIL036 = require("../../models/smartApp/COUNCIL036");
const DOC00001 = require("../../models/smartApp/DOC00001");
const DOC00002 = require("../../models/smartApp/DOC00002");
const DOC00003 = require("../../models/smartApp/DOC00003");
const EDU00001 = require("../../models/smartApp/EDU00001");
const EDU00002 = require("../../models/smartApp/EDU00002");
const EDU00003 = require("../../models/smartApp/EDU00003");
const EDU00004 = require("../../models/smartApp/EDU00004");
const EDU00005 = require("../../models/smartApp/EDU00005");
const EDU00006 = require("../../models/smartApp/EDU00006");
const EDU00007 = require("../../models/smartApp/EDU00007");
const EDU00008 = require("../../models/smartApp/EDU00008");
const EDU00009 = require("../../models/smartApp/EDU00009");
const EDU00010 = require("../../models/smartApp/EDU00010");
const EDU00011 = require("../../models/smartApp/EDU00011");
const EDU00013 = require("../../models/smartApp/EDU00013");
const EDU00014 = require("../../models/smartApp/EDU00014");
const EDU00015 = require("../../models/smartApp/EDU00015");
const EDU00016 = require("../../models/smartApp/EDU00016");
const EDU00018 = require("../../models/smartApp/EDU00018");
const EDU00019 = require("../../models/smartApp/EDU00019");
const EDU00021 = require("../../models/smartApp/EDU00021");
const EDU00097 = require("../../models/smartApp/EDU00097");
const EDU00098 = require("../../models/smartApp/EDU00098");
const EDU0100 = require("../../models/smartApp/EDU0100");
const EMP00001 = require("../../models/smartApp/EMP00001");
const EMP00002 = require("../../models/smartApp/EMP00002");
const EMP00004 = require("../../models/smartApp/EMP00004");
const EMP00006 = require("../../models/smartApp/EMP00006");
const EMP00006OLD = require("../../models/smartApp/EMP00006OLD");
const EMP00008 = require("../../models/smartApp/EMP00008");
const EMP00013 = require("../../models/smartApp/EMP00013");
const EMP00021 = require("../../models/smartApp/EMP00021");
const EMPBOK01 = require("../../models/smartApp/EMPBOK01");
const EMPACC01 = require("../../models/smartApp/EMPACC01");
const ERP00002 = require("../../models/smartApp/ERP00002");
const ERP00003 = require("../../models/smartApp/ERP00003");
const ERP00004 = require("../../models/smartApp/ERP00004");
const ERP00005 = require("../../models/smartApp/ERP00005");
const ERP00008 = require("../../models/smartApp/ERP00008");
const ERP00009 = require("../../models/smartApp/ERP00009");
const ERP00010 = require("../../models/smartApp/ERP00010");
const ERP00014 = require("../../models/smartApp/ERP00014");
const HC0002 = require("../../models/smartApp/HC0002");
const HC0003 = require("../../models/smartApp/HC0003");
const HC0004 = require("../../models/smartApp/HC0004");
const HOSP0003 = require("../../models/smartApp/HOSP0003");
const HOSP0004 = require("../../models/smartApp/HOSP0004");
const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
const JOB00001 = require("../../models/smartApp/JOB00001");
const LOG00001 = require("../../models/smartApp/LOG00001");
const LOG00002 = require("../../models/smartApp/LOG00002");
const LOG00003 = require("../../models/smartApp/LOG00003");
const LOG00004 = require("../../models/smartApp/LOG00004");
const PM00001 = require("../../models/smartApp/PM00001");
const SUPP00007 = require("../../models/smartApp/SUPP00007");
const SUPP00011 = require("../../models/smartApp/SUPP00011");
const SUPP00012 = require("../../models/smartApp/SUPP00012");
const SUPP00013 = require("../../models/smartApp/SUPP00013");
const SUPP00014 = require("../../models/smartApp/SUPP00014");
const SUPP00015 = require("../../models/smartApp/SUPP00015");
const SUPP00016 = require("../../models/smartApp/SUPP00016");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.temp = asyncHandler(async (req, res, next) => {
  /// --------------------------------- ///
  ///        Get inputs ..........
  /// --------------------------------- ///
  // Get App from Header
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessRole,
  });
  // Read New Config File
  var cardConfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  /// -------------------------------------------- ///
  ///        Collect Field Names ..........
  /// --------------------------------------------- ///
  myFieldArray = [];
  myPossValArray = [];
  pvalObj = {};
  pvalArr = [];
  for (let index = 0; index < cardConfig.FieldDef.length; index++) {
    const element1 = cardConfig.FieldDef[index].name;
    myFieldArray.push(element1);
  }
  exclude_array = [
    "appId",
    "applicationId",
    "user",
    "userName",
    "userEmail",
    "company",
    "companyName",
    "branch",
    "branchName",
    "area",
    "areaName",
    "ItemData",
    "TransLog",
  ];
  myFieldArray.push.apply(myFieldArray, exclude_array);

  /// -------------------------------------------- ///
  ///        Check input Fields with Config ..........
  /// --------------------------------------------- ///
  for (let index = 0; index < myFieldArray.length; index++) {
    const el1 = myFieldArray[index];
    app1 = req.headers.applicationid;
    app2 = "GLOBAL";
    role1 = req.headers.businessrole;
    role2 = "ALL";
    pVal1 = el1;
    let query;
    query = Possval.find(
      {
        PossibleValues: pVal1,
        ApplicationID: { $in: [app1, app2] },
        Role: { $in: [role1, role2] },
      },
      { _id: 0 }
    );
    const fields = "Value";
    query = query.select(fields);
    const rslt = await query;
    if (rslt.length > 0) {
      myPossValArray.push(el1);
      pvalObj[el1] = rslt;
      // Note: append only values
      pvalArr.push(pvalObj);
    }
  }
  // ---------------------
  // App ID and Validate
  // ---------------------
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;
  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID`, 400));
  }
  req.body.user = req.user.id;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;

  // ---------------------------------
  // Get Company Details and Validate
  // ---------------------------------
  const CompanyDetails = await Company.findById(req.user.company);
  // Check if user setup has company (Pass)
  if (!req.user.company) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.email} is not setup for any company`,
        400
      )
    );
  }
  // Validate if user is creating documents in their own company (Pass)
  if (req.headers.company) {
    if (req.headers.company != CompanyDetails.id) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create any documents for others companies`,
          400
        )
      );
    }
  }
  // Company validation passed, now USER company can be used!!
  req.body.company = CompanyDetails.id;
  req.body.companyName = CompanyDetails.companyName;

  // ---------------------------------
  // Get Branch Details and Validate
  // ---------------------------------
  if (req.headers.branchname) {
    const BodyBranch = await Branch.findOne({
      branchName: req.headers.branchname,
      companyId: req.body.company,
    });
    if (BodyBranch) {
      req.body.branch = BodyBranch.id;
      req.body.branchName = BodyBranch.branchName;
    }
  }
  // ---------------------------------
  // Get Area Details and Validate
  // ---------------------------------
  if (req.headers.areaname) {
    const BodyArea = await Area.findOne({
      areaName: req.headers.areaname,
      companyId: req.body.company,
    });
    if (BodyArea) {
      req.body.area = BodyArea.id;
      req.body.areaName = BodyArea.areaName;
    }
  }
  // Validate if user has provided Branch details (Pass)
  if (!req.headers.branch) {
    if (!req.user.branch) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document as branch is not provided`,
          400
        )
      );
    }
  }
  // If user record has got Branch then validate is it matches with body Branch
  if (req.user.branch) {
    // if no Area in body but user has area then use it
    if (!req.headers.branch) {
      req.body.branch = req.user.branch;
      // myorg.branchName = BodyBranch.branchName;
    }
    if (req.body.branch != req.user.branch) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document for other branches`,
          400
        )
      );
    }
  }
  // Branch validation passed, now get Branch details and set Body
  const BranchDetails = await Branch.findById(req.headers.branch);
  if (BranchDetails) {
    req.body.branch = BranchDetails.branch;
    req.body.branchName = BranchDetails.branchName;
  }
  if (!req.headers.area) {
    if (!req.user.area) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document as business area can't be determined`,
          400
        )
      );
    }
  }
  // If user record has got Area then validate is it matches with body Area
  if (req.user.area) {
    // if no Area in body but user has area then use it
    if (!req.headers.area) {
      req.body.area = req.user.area;
    }

    // if body and user both have area then they should be same (Validation  - Pass)
    if (req.body.area != req.user.area) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document for other business area`,
          400
        )
      );
    }
  }
  // Area validation passed, now get Area details and set Body
  const AreaDetails = await Area.findById(req.headers.area);
  if (AreaDetails) {
    req.body.areaName = AreaDetails.areaName;
    req.body.area = AreaDetails.id;
  }

  // Field Translation..

  // Set Processing/Transaction Log
  let pLog = {};
  let pg1 = [];
  pLog["Type"] = "NEW_RECORD";
  pLog["User"] = req.body.user;
  pLog["UserName"] = req.body.userName;
  pLog["Status"] = req.body.Status;
  pLog["TimeStamp"] = Date.now();
  pLog["ID"] = req.body.ID;
  pLog["applicationId"] = req.body.applicationId;
  pg1.push(pLog);
  req.body.TransLog = pg1;
  req.body.ID = Math.floor(100000 + Math.random() * 900000);
  //req.body.OrgData = myorg;
  if (req.body.ItemData) {
    for (let index = 0; index < req.body.ItemData.length; index++) {
      const element = req.body.ItemData[index];
      req.body.ItemData[index]["ID"] = req.body.ID;
    }
  }

  mydata = req.body;

  // Read Card Configuration for the Role (X1)
  if (req.headers.fieldnames == "X") {
    mydata = {};
    mydata.appId = req.body.appId;
    mydata.applicationId = req.body.applicationId;
    mydata.user = req.body.user;
    mydata.userName = req.body.userName;
    mydata.userEmail = req.body.userEmail;
    mydata.company = req.body.company;
    mydata.companyName = req.body.companyName;
    mydata.branch = req.body.branch;
    mydata.branchName = req.body.branchName;
    mydata.area = req.body.area;
    mydata.areaName = req.body.areaName;
    mydata.ItemData = req.body.ItemData;
    mydata.TransLog = req.body.TransLog;
    for (const key in req.body) {
      cardConfig["FieldDef"].forEach((element1) => {
        if (req.body.hasOwnProperty(key) & (element1["SLabel"] == key)) {
          console.log(key);
          console.log(element1["SLabel"]);
          console.log(req.body[key]);
          console.log(element1["name"]);
          mydata[element1["name"]] = req.body[key];
        }
      });
    }
  }
  console.log("After Trans", mydata);
  req.body = mydata;

  mydata = {};

  pagination = {};

  config = {};

  res.status(200).json({
    success: true,
    count: 1,
    pagination,
    //  data: result,
    // cardImage: app["photo"],
    config: config,
  });
});
