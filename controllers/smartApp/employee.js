const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const geocoder = require("../../utils/geocoder");
const path = require("path");

const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
const Employee = require("../../models/smartApp/Employee");
const Education = require("../../models/smartApp/Education");
const Appschema = require("../../models/appSetup/Appschema");

// @desc      Get records
// @route     GET /api/v1/records
// @route     GET /api/v1/companies/:companyId/records
// @access    Public
exports.getRecords = asyncHandler(async (req, res, next) => {
  // Get User from Token
  req.body.user = req.user.id;
  // Get Login User Details
  const userRecord = await User.findById(req.body.user);
});

// @desc      Get single record
// @route     GET /api/v1/records/:id
// @access    Public
exports.getRecord = asyncHandler(async (req, res, next) => {});

// @desc      Add record
// @route     POST /api/v1/employee/records
// @access    Private
exports.addRecord = asyncHandler(async (req, res, next) => {
  // Get App from Body
  if (req.body.applicationID) {
    const BodyApp = await App.findOne({
      applicationID: req.body.applicationID,
    });
    req.body.appId = BodyApp.id;
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
  if (AppSc.schemaApp == "Education") {
    const result = await Education.create(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  }

  if (AppSc.schemaApp == "Employee") {
    const result = await Employee.create(req.body);
    res.status(201).json({
      success: true,
      data: result,
    });
  }
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

// @desc      Excel Upload records for a App
// @route     POST /api/v1/employee/csvupload
// @access    Private
exports.recordFileUpload = asyncHandler(async (req, res, next) => {
  // Get App from Body
  if (req.body.applicationID) {
    const BodyApp = await App.findOne({
      applicationID: req.body.applicationID,
    });
    req.body.appId = BodyApp.id;
  }

  // Get User from Token
  req.body.user = req.user.id;
  // Get Login User Details
  const userRecord = await User.findById(req.body.user);
  // Get Company Details
  const CompanyDetails = await Company.findById(userRecord.company);

  // File Upload
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  const file = req.files.file;

  // Make sure the image is a photo
  console.log(file.mimetype);
  if (!file.mimetype.startsWith("text/csv")) {
    return next(new ErrorResponse(`Please upload an csv file`, 400));
  }

  // Check filesize
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  console.log(file.data);
  // Create custom filename
  //file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

  //file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (err) => {
  //  if (err) {
  //    console.error(err);
  //    return next(new ErrorResponse(`Problem with file upload`, 500));
  //  }

  //  await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });

  res.status(200).json({
    success: true,
    data: file.name,
  });
});
