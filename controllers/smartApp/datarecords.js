const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");
const mongoose = require("mongoose");

const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");

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
const HOSP0003 = require("../../models/smartApp/HOSP0003");
const HOSP0004 = require("../../models/smartApp/HOSP0004");
const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
const JOB00001 = require("../../models/smartApp/JOB00001");
const LOG00001 = require("../../models/smartApp/LOG00001");
const LOG00002 = require("../../models/smartApp/LOG00002");
const LOG00003 = require("../../models/smartApp/LOG00003");
const LOG00004 = require("../../models/smartApp/LOG00004");
const PM00001 = require("../../models/smartApp/PM00001");
const SUPP00011 = require("../../models/smartApp/SUPP00011");
const SUPP00012 = require("../../models/smartApp/SUPP00012");
const SUPP00013 = require("../../models/smartApp/SUPP00013");
const SUPP00014 = require("../../models/smartApp/SUPP00014");
const SUPP00015 = require("../../models/smartApp/SUPP00015");
const SUPP00016 = require("../../models/smartApp/SUPP00016");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00028 = require("../../models/smartApp/SUPP00028");

var sch = require("../../applicationJSON/Schema_Master.json");

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.addDataRecords = asyncHandler(async (req, res, next) => {
  //let myorg = {};
  console.log("Headers....", req.headers);
  // Get App from Header
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessRole,
  });
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;
  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID`, 400));
  }

  req.body.user = req.user.id;
  //myorg.businessRole = req.user.role;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;
  console.log(req.body.userEmail);
  // Get Company Details
  const CompanyDetails = await Company.findById(req.user.company);

  ///  +++++++++++  VALIDATIONS STARTS +++++++++++++++++++++++ /////////
  // Check if user setup has company (Pass)
  if (!req.user.company) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.email} is not setup for any company, please contact administrator`,
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

  // Get Branch from Header
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
  // Get Area from Body
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
      console.log("branch is picked from User Record");
      req.body.branch = req.user.branch;
      // myorg.branchName = BodyBranch.branchName;
    }

    if (req.body.branch != req.user.branch) {
      console.log("Branch in body and user record are different");
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
      console.log("Area is picked from User Record");
      req.body.area = req.user.area;
    }

    // if body and user both have area then they should be same (Validation  - Pass)
    if (req.body.area != req.user.area) {
      console.log("Area in body and user record are different");
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
  ///  +++++++++++  VALIDATIONS ENDS +++++++++++++++++++++++ /////////

  //req.body.OrgData = myorg;
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

    let fileName =
      "../../NewConfig/" +
      req.headers.applicationid +
      "_" +
      req.headers.businessrole +
      "_config.json";
    var cardConfig = require(fileName);
    /*     cardConfig["FieldDef"].forEach((element1) => {
      for (const key in req.body) {
        if (req.body.hasOwnProperty(key) & (element1["SLabel"] == key)) {
          mydata[element1["name"]] = req.body[key];
        }
      }
    }); */
    for (const key in req.body) {
      cardConfig["FieldDef"].forEach((element1) => {
        if (req.body.hasOwnProperty(key) & (element1["SLabel"] == key)) {
          mydata[element1["name"]] = req.body[key];
        }
      });
    }
  }
  //// Add similar Logic for Items as well
  //console.log("Config", cardConfig["FieldDef"]);

  let result;
  if (req.headers.applicationid == "EDU00001") {
    result = await EDU00001.create(mydata);
  }
  if (req.headers.applicationid == "EDU00002") {
    result = await EDU00002.create(mydata);
  }
  if (req.headers.applicationid == "EDU00003") {
    result = await EDU00003.create(mydata);
  }
  if (req.headers.applicationid == "EDU00004") {
    result = await EDU00004.create(mydata);
  }
  if (req.headers.applicationid == "EDU00005") {
    result = await EDU00005.create(mydata);
  }
  if (req.headers.applicationid == "EDU00006") {
    result = await EDU00006.create(mydata);
  }
  if (req.headers.applicationid == "EDU00007") {
    result = await EDU00007.create(mydata);
  }
  if (req.headers.applicationid == "EDU00008") {
    result = await EDU00008.create(mydata);
  }
  if (req.headers.applicationid == "EDU00009") {
    result = await EDU00009.create(mydata);
  }
  if (req.headers.applicationid == "EDU00010") {
    result = await EDU00010.create(mydata);
  }
  if (req.headers.applicationid == "EDU00011") {
    result = await EDU00011.create(mydata);
  }
  if (req.headers.applicationid == "EDU00013") {
    result = await EDU00013.create(mydata);
  }
  if (req.headers.applicationid == "EDU00014") {
    result = await EDU00014.create(mydata);
  }
  if (req.headers.applicationid == "EDU00015") {
    result = await EDU00015.create(mydata);
  }
  if (req.headers.applicationid == "EDU00016") {
    result = await EDU00016.create(mydata);
  }
  if (req.headers.applicationid == "EDU00018") {
    result = await EDU00018.create(mydata);
  }
  if (req.headers.applicationid == "EDU00019") {
    result = await EDU00019.create(mydata);
  }
  if (req.headers.applicationid == "EDU00021") {
    result = await EDU00021.create(mydata);
  }

  if (req.headers.applicationid == "EDU00097") {
    const EDU00097 = require("../../models/smartApp/EDU00097");
    result = await EDU00097.create(mydata);
  }
  if (req.headers.applicationid == "EDU00098") {
    result = await EDU00098.create(mydata);
  }
  if (req.headers.applicationid == "EDU0100") {
    result = await EDU0100.create(mydata);
  }

  if (req.headers.applicationid == "BUS0000002") {
    result = await BUS0000002.create(mydata);
  }
  if (req.headers.applicationid == "BUS0000003") {
    result = await BUS0000003.create(mydata);
  }
  if (req.headers.applicationid == "BUS0000004") {
    result = await BUS0000004.create(mydata);
  }
  if (req.headers.applicationid == "BUS0000005") {
    result = await BUS0000005.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL002") {
    result = await COUNCIL002.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL003") {
    result = await COUNCIL003.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL007") {
    result = await COUNCIL007.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL012") {
    result = await COUNCIL012.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL015") {
    result = await COUNCIL015.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL022") {
    result = await COUNCIL022.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL023") {
    result = await COUNCIL023.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL026") {
    result = await COUNCIL026.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL029") {
    result = await COUNCIL029.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL033") {
    result = await COUNCIL033.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL034") {
    result = await COUNCIL034.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL035") {
    result = await COUNCIL035.create(mydata);
  }
  if (req.headers.applicationid == "COUNCIL036") {
    result = await COUNCIL036.create(mydata);
  }
  if (req.headers.applicationid == "DOC00001") {
    result = await DOC00001.create(mydata);
  }
  if (req.headers.applicationid == "DOC00002") {
    result = await DOC00002.create(mydata);
  }
  if (req.headers.applicationid == "DOC00003") {
    result = await DOC00003.create(mydata);
  }

  if (req.headers.applicationid == "EMP00001") {
    result = await EMP00001.create(mydata);
  }
  if (req.headers.applicationid == "EMP00002") {
    result = await EMP00002.create(mydata);
  }
  if (req.headers.applicationid == "EMP00004") {
    result = await EMP00004.create(mydata);
  }
  if (req.headers.applicationid == "EMP00006") {
    result = await EMP00006.create(mydata);
  }
  if (req.headers.applicationid == "EMP00006OLD") {
    result = await EMP00006OLD.create(mydata);
  }
  if (req.headers.applicationid == "EMP00008") {
    result = await EMP00008.create(mydata);
  }
  if (req.headers.applicationid == "EMP00013") {
    result = await EMP00013.create(mydata);
  }
  if (req.headers.applicationid == "EMP00021") {
    result = await EMP00021.create(mydata);
  }
  if (req.headers.applicationid == "EMPACC01") {
    result = await EMPACC01.create(mydata);
  }
  if (req.headers.applicationid == "EMPBOK01") {
    result = await EMPBOK01.create(mydata);
  }
  if (req.headers.applicationid == "ERP00002") {
    result = await ERP00002.create(mydata);
  }
  if (req.headers.applicationid == "ERP00003") {
    result = await ERP00003.create(mydata);
  }
  if (req.headers.applicationid == "ERP00004") {
    result = await ERP00004.create(mydata);
  }
  if (req.headers.applicationid == "ERP00005") {
    result = await ERP00005.create(mydata);
  }
  if (req.headers.applicationid == "ERP00008") {
    result = await ERP00008.create(mydata);
  }
  if (req.headers.applicationid == "ERP00009") {
    result = await ERP00009.create(mydata);
  }
  if (req.headers.applicationid == "ERP00010") {
    result = await ERP00010.create(mydata);
  }
  if (req.headers.applicationid == "ERP00014") {
    result = await ERP00014.create(mydata);
  }
  if (req.headers.applicationid == "HOSP0003") {
    result = await HOSP0003.create(mydata);
  }
  if (req.headers.applicationid == "HOSP0004") {
    result = await HOSP0004.create(mydata);
  }
  if (req.headers.applicationid == "ITPROJ002") {
    result = await ITPROJ002.create(mydata);
  }
  if (req.headers.applicationid == "JOB00001") {
    result = await JOB00001.create(mydata);
  }
  if (req.headers.applicationid == "LOG00001") {
    result = await LOG00001.create(mydata);
  }
  if (req.headers.applicationid == "LOG00002") {
    result = await LOG00002.create(mydata);
  }
  if (req.headers.applicationid == "LOG00003") {
    result = await LOG00003.create(mydata);
  }
  if (req.headers.applicationid == "LOG00004") {
    result = await LOG00004.create(mydata);
  }
  if (req.headers.applicationid == "PM00001") {
    result = await PM00001.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00011") {
    result = await SUPP00011.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00012") {
    result = await SUPP00012.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00013") {
    result = await SUPP00013.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00014") {
    result = await SUPP00014.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00015") {
    result = await SUPP00015.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00016") {
    result = await SUPP00016.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00018") {
    result = await SUPP00018.create(mydata);
  }
  if (req.headers.applicationid == "SUPP00028") {
    result = await SUPP00028.create(mydata);
  }

  console.log(result);
  mydata = {};
  res.status(201).json({
    success: true,
    data: result,
  });
});

// @desc      Update record
// @route     PUT /api/v1/records/:id
// @access    Private
exports.updateRecord = asyncHandler(async (req, res, next) => {});

// @desc      Delete record
// @route     DELETE /api/v1/records/:id
// @access    Private
exports.deleteRecord = asyncHandler(async (req, res, next) => {});

// @desc      Get records within a radius
// @route     GET /api/v1/records/radius/:zipcode/:distance
// @access    Private
exports.getRecordsInRadius = asyncHandler(async (req, res, next) => {});

// @desc      Upload photo for record
// @route     PUT /api/v1/records/:id/photo
// @access    Private
exports.recordPhotoUpload = asyncHandler(async (req, res, next) => {});
