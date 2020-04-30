const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");
const mongoose = require("mongoose");

const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const User = require("../../models/User");
const App = require("../../models/appSetup/App");
//const Employee = require("../../models/smartApp/Employee");
//const Education = require("../../models/smartApp/Education");
const Appschema = require("../../models/appSetup/Appschema");

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

const EDU00098 = require("../../models/smartApp/EDU00098");
const EDU0100 = require("../../models/smartApp/EDU0100");

var sch = require("../../applicationJSON/Schema_Master.json");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getListrecords = asyncHandler(async (req, res, next) => {
  outData = res.advancedDataList;
  res.status(200).json(outData);
});
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.addListrecords = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedCreate);
});
// @desc      Get single record
// @route     GET /api/v1/records/
// @access    Public
exports.getRecord = asyncHandler(async (req, res, next) => {});

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.addDataRecords = asyncHandler(async (req, res, next) => {
  // Get App from Body
  console.log("Authorization:", req.headers.authorization);
  console.log("App", req.body.appplicationID);
  //console.log(req.body.appplicationID);
  const BodyApp = await App.findOne({ applicationID: req.body.appplicationID });

  req.body.appId = BodyApp.id;
  console.log(req.body.appId);

  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID`, 400));
  }

  // Get User from Token
  req.body.user = req.user.id;
  // Get Login User Details
  const userRecord = await User.findById(req.body.user);
  // Get Company Details
  const CompanyDetails = await Company.findById(userRecord.company);

  ///  +++++++++++  VALIDATIONS STARTS +++++++++++++++++++++++ /////////
  // Check if user setup has company (Pass)
  if (!userRecord.company) {
    return next(
      new ErrorResponse(
        `The user with ID ${req.user.email} is not setup for any company, please contact administrator`,
        400
      )
    );
  }
  // Validate if user is creating documents in their own company (Pass)
  if (req.body.company) {
    if (req.body.company != CompanyDetails.id) {
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

  // Get Branch from Body
  if (req.body.branchName) {
    const BodyBranch = await Branch.findOne({
      branchName: req.body.branchName,
      companyId: req.body.company,
    });
    if (BodyBranch) {
      req.body.branch = BodyBranch.id;
    }
  }
  // Get Area from Body
  if (req.body.areaName) {
    const BodyArea = await Area.findOne({
      areaName: req.body.areaName,
      companyId: req.body.company,
    });
    if (BodyArea) {
      req.body.area = BodyArea.id;
    }
  }

  // Validate if user has provided Branch details (Pass)
  if (!req.body.branch) {
    if (!userRecord.branch) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document as branch is not provided`,
          400
        )
      );
    }
  }
  // If user record has got Branch then validate is it matches with body Branch
  if (userRecord.branch) {
    // if no Area in body but user has area then use it
    if (!req.body.branch) {
      console.log("branch is picked from User Record");
      req.body.branch = userRecord.branch;
    }

    if (req.body.branch != userRecord.branch) {
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
  const BranchDetails = await Branch.findById(req.body.branch);
  if (BranchDetails) {
    req.body.branchName = BranchDetails.branchName;
  }

  if (!req.body.area) {
    if (!userRecord.area) {
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document as business area can't be determined`,
          400
        )
      );
    }
  }

  // If user record has got Area then validate is it matches with body Area
  if (userRecord.area) {
    // if no Area in body but user has area then use it
    if (!req.body.area) {
      console.log("Area is picked from User Record");
      req.body.area = userRecord.area;
    }

    // if body and user both have area then they should be same (Validation  - Pass)
    if (req.body.area != userRecord.area) {
      console.log("Area in body and user record are different");
      return next(
        new ErrorResponse(
          `The user with ID ${req.user.email} can't create document for other business area`,
          400
        )
      );
    }
  }
  // Branch validation passed, now get Branch details and set Body
  const AreaDetails = await Area.findById(req.body.area);
  if (AreaDetails) {
    req.body.areaName = AreaDetails.areaName;
  }

  ///  +++++++++++  VALIDATIONS ENDS +++++++++++++++++++++++ /////////

  const AppSc = await Appschema.findOne({
    appID: req.body.applicationID,
  });
  let result;
  if (req.body.appplicationID == "EDU00001") {
    result = await EDU00001.create(req.body);
  }
  if (req.body.appplicationID == "EDU00002") {
    result = await EDU00002.create(req.body);
  }
  if (req.body.appplicationID == "EDU00003") {
    result = await EDU00003.create(req.body);
  }
  if (req.body.appplicationID == "EDU00004") {
    result = await EDU00004.create(req.body);
  }
  if (req.body.appplicationID == "EDU00005") {
    result = await EDU00005.create(req.body);
  }
  if (req.body.appplicationID == "EDU00006") {
    result = await EDU00006.create(req.body);
  }
  if (req.body.appplicationID == "EDU00007") {
    result = await EDU00007.create(req.body);
  }
  if (req.body.appplicationID == "EDU00008") {
    result = await EDU00008.create(req.body);
  }
  if (req.body.appplicationID == "EDU00009") {
    result = await EDU00009.create(req.body);
  }
  if (req.body.appplicationID == "EDU00010") {
    result = await EDU00010.create(req.body);
  }
  if (req.body.appplicationID == "EDU00011") {
    result = await EDU00011.create(req.body);
  }
  if (req.body.appplicationID == "EDU00013") {
    result = await EDU00013.create(req.body);
  }
  if (req.body.appplicationID == "EDU00014") {
    result = await EDU00014.create(req.body);
  }
  if (req.body.appplicationID == "EDU00015") {
    result = await EDU00015.create(req.body);
  }
  if (req.body.appplicationID == "EDU00016") {
    result = await EDU00016.create(req.body);
  }
  if (req.body.appplicationID == "EDU00018") {
    result = await EDU00018.create(req.body);
  }
  if (req.body.appplicationID == "EDU00019") {
    result = await EDU00019.create(req.body);
  }
  if (req.body.appplicationID == "EDU00021") {
    result = await EDU00021.create(req.body);
  }

  if (req.body.appplicationID == "EDU00097") {
    const EDU00097 = require("../../models/smartApp/EDU00097");
    result = await EDU00097.create(req.body);
  }
  if (req.body.appplicationID == "EDU00098") {
    result = await EDU00098.create(req.body);
  }
  if (req.body.appplicationID == "EDU0100") {
    result = await EDU0100.create(req.body);
  }

  res.status(201).json({
    success: true,
    data: result,
    app: req.body.appplicationID,
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
