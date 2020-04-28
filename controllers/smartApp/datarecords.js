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
const EDU00097 = require("../../models/smartApp/EDU00097");
const EDU00098 = require("../../models/smartApp/EDU00098");
const EDU0100 = require("../../models/smartApp/EDU0100");

// @desc      Get records
// @route     GET /api/v1/records
// @route     GET /api/v1/companies/:companyId/records
// @access    Public
exports.getRecords = asyncHandler(async (req, res, next) => {
  console.log(req.body.appplicationID);
  const BodyApp = await App.findOne({ applicationID: req.body.appplicationID });
  // Get User from Token
  //console.log(req.body.user);
  //req.body.user = req.user.id;
  // Get Login User Details
  //const userRecord = await User.findById(req.body.user);
  console.log(req.body);
  console.log(BodyApp);
  if (req.body.appplicationID == "EDU00097") {
    const mydatalist = await EDU00097.find({ Status: "Requested" });
    return res.status(200).json({
      success: true,
      count: mydatalist.length,
      data: mydatalist,
    });
  }
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
  console.log(req.body.appplicationID);
  const BodyApp = await App.findOne({ applicationID: req.body.appplicationID });

  req.body.appId = BodyApp.id;
  console.log(req.body.appId);

  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID`, 400));
  }

  //var json = require("../../applicationJSON/EDU00097.json");

  /* //// Generic Validations....... ///////
  //RegEx for validating emailIDs
  EMAIL_V1 = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  //RegEx for validating Website
  WEBSITE_V1 = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  //RegEx for validating an float with two decimal places
  NUM_2_DEC_PLACE_V1 = /^(?!^0\.00$)(([1-9][\d]{0,6})|([0]))\.[\d]{2}$/;
  //RegEx for validating an integer with a maximum length of 10 characters
  NUM_INT_MAX_10D_V1 = /[^0-9][+-]?[0-9]{1,10}[^0-9]/;
  //RegEx for Latitude validation
  LATITUDE_V1 = /^(\+|-)?(?:90(?:(?:\.0{1,6})?)|(?:[0-9]|[1-8][0-9])(?:(?:\.[0-9]{1,6})?))$/;
  //RegEx for Longitude validation
  LONGITUDE_V1 = /^-?([1]?[1-7][1-9]|[1]?[1-8][0]|[1-9]?[0-9])\.{1}\d{1,6}/;
  //No Whitespace
  NO_WHITESPACE_V1 = /^[^\s]+$/;

  TWITTER_ACCOUNT_V1 = /^@?(\w){1,15}$/;

  TWITTER_URL_V1 = /http(?:s)?:\/\/(?:www\.)?twitter\.com\/([a-zA-Z0-9_]+)/;

  LINKEDIN_URL_V1 = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/;

  FACEBOOK_URL_V1 = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;

  GENDER_V1 = /^(?:m|M|male|Male|f|F|female|Female)$/;

  PERCENTAGE_V1 = /^(0*100{1,1}\.?((?<=\.)0*)?%?$)|(^0*\d{0,2}\.?((?<=\.)\d*)?%?)$/;
  //RegEx to validate Full Path and CSV
  FULL_FILE_PATH_CSV_V1 = /^(?<Drive>([a-zA-Z]:)|(\\{2}\w+)\$?)(\\(\w[\w].*))(?<Year>\d{4})-(?<Month>\d{1,2})-(?<Day>\d{1,2})(?<ExtraText>.*)(?<Extension>.csv|.CSV)$/;
  //RegEx to validate Date in YYYY-MM-DD fromat
  DATE_V1 = /[0-9]{4}-([0][0-9]|[1][0-2])-([0][0-9]|[1][0-9]|[2][0-9]|[3][0-1])/;

  //DUNS Number (123123123)
  DUNS_NUM_V1 = /^\d{9}$/;

  // Validate Year YYYY
  YEAR_V1 = /^\d{4}$/;
  //// UK Validations....... ///////
  //RegEx for validating UK Post Code
  UK_POSTCODE_V1 = /[A-Z]{1,2}[0-9]{1,2}[A-Z]?\s?[0-9][A-Z]{2}/i;
  //RegEx for validating UK NI Number
  UK_NI_NUMBER_V1 = /^[A-CEGHJ-PR-TW-Z]{1}[A-CEGHJ-NPR-TW-Z]{1}[0-9]{6}[A-DFM]{0,1}$/;
  //RegEx for validating UK Bank Sortcode
  UK_BANK_SORTCODE_V1 = /^[0-9]{2}[-][0-9]{2}[-][0-9]{2}$/;
  //RegEx for validating UK Bank Account
  UK_BANK_ACCOUNT = /^(\d){8}$/;
  //RegEx to validate UK Mobile number
  UK_MOBILE_V1 = /^(\+44\s?7\d{3}|\(?07\d{3}\)?)\s?\d{3}\s?\d{3}$/;
  //RegEx to validate UK Phone number
  UK_PHONE_V1 = /(((\+44)? ?(\(0\))? ?)|(0))( ?[0-9]{3,4}){3}/;
  //RegEx to validate UK Car Reg Number - DVLA
  UK_CAR_REG_V1 = /(^[A-Z]{2}[0-9]{2}\s?[A-Z]{3}$)|(^[A-Z][0-9]{1,3}[A-Z]{3}$)|(^[A-Z]{3}[0-9]{1,3}[A-Z]$)|(^[0-9]{1,4}[A-Z]{1,2}$)|(^[0-9]{1,3}[A-Z]{1,3}$)|(^[A-Z]{1,2}[0-9]{1,4}$)|(^[A-Z]{1,3}[0-9]{1,3}$)|(^[A-Z]{1,3}[0-9]{1,4}$)|(^[0-9]{3}[DX]{1}[0-9]{3}$)/;
  //RegEx to validate UK Car Reg Number
  UK_CAR_REG_V2 = /(^[A-Z]{2}[0-9]{2} [A-Z]{3}$)|(^[A-Z][0-9]{1,3} [A-Z]{3}$)|(^[A-Z]{3} [0-9]{1,3}[A-Z]$)|(^[0-9]{1,4} [A-Z]{1,2}$)|(^[0-9]{1,3} [A-Z]{1,3}$)|(^[A-Z]{1,2} [0-9]{1,4}$)|(^[A-Z]{1,3} [0-9]{1,3}$)/;
  //RegEx to validate UK VAT Registration Number
  UK_VATREGNO_V1 = /^([GB])*(([1-9]\d{8})|([1-9]\d{11}))$/;
  //UK Company Name
  UK_COMPANYNAME_V1 = /^(?!\s)(?!.*\s$)(?=.*[a-zA-Z0-9])[a-zA-Z0-9 '~?!]{2,}$/;
  //UK Company Reg
  UK_COMPANY_REG_V1 = /^[0-9]{8}$/;
  //NHS Hospital Number (D Number)
  NHS_HOSPITAL_NUM_V1 = /[DJF]{1}[0-9]{5,8}/;

  UK_DRIVING_LICENCE_V1 = /^[A-Z9]{5}[0-9]([05][1-9]|[16][0-2])(0[1-9]|[12][0-9]|3[01])[0-9][A-Z9][0-9][A-Z0-9]([0-9]{2}?)$/;

  /// INDIA Validations ///////
  // India PIN Number (400 099 | 400099 | 400050)
  IN_PINCODE_V1 = /^\d{3}\s?\d{3}$/;
  // India Mobile Number
  IN_MOBILE_V1 = /^([9]{1})([234789]{1})([0-9]{8})$/;
  //RegEx to validate UK VAT Registration Number (mh-12-bj-1780 | mmx-1234)
  IN_VECH_REG_V1 = /^([A-Z|a-z]{2}-\d{2}-[A-Z|a-z]{2}-\d{1,4})?([A-Z|a-z]{3}-\d{1,4})?$/;
  // India Phone Number (+919847444225 | +91-98-44111112 | 98 44111116)
  IN_PHONE_V1 = /^((\+){0,1}91(\s){0,1}(\-){0,1}(\s){0,1}){0,1}98(\s){0,1}(\-){0,1}(\s){0,1}[1-9]{1}[0-9]{7}$/;
  //Indian Passport No Format (A-1234567)
  IN_PASSPORT_V1 = /^[A-Z]{1}-[0-9]{7}$/;

  /// US Validations ///////
  //RegEx for US Zip Code
  US_STATE_ZIPCODE_V1 = /\d{5}(-\d{4})?/;
  // US Social Sec Number
  US_SOCIAL_SEC_V1 = /^\d{3}-\d{2}-\d{4}$/; */

  /* for (let prop in json) {
    if (json[prop].match) {
      console.log(json[prop].match[0]);

      if (json[prop].match[0] == "EMAIL_V1") {
        json[prop].match[0] = EMAIL_V1;
      }
      if (json[prop].match[0] == "WEBSITE_V1") {
        json[prop].match[0] = WEBSITE_V1;
      }

      if (json[prop].match[0] == "NUM_2_DEC_PLACE_V1") {
        json[prop].match[0] = NUM_2_DEC_PLACE_V1;
      }
      if (json[prop].match[0] == "NUM_INT_MAX_10D_V1") {
        json[prop].match[0] = NUM_INT_MAX_10D_V1;
      }
      if (json[prop].match[0] == "LATITUDE_V1") {
        json[prop].match[0] = LATITUDE_V1;
      }
      if (json[prop].match[0] == "LONGITUDE_V1") {
        json[prop].match[0] = LONGITUDE_V1;
      }
      if (json[prop].match[0] == "NO_WHITESPACE_V1") {
        json[prop].match[0] = NO_WHITESPACE_V1;
      }
      if (json[prop].match[0] == "TWITTER_ACCOUNT_V1") {
        json[prop].match[0] = TWITTER_ACCOUNT_V1;
      }
      if (json[prop].match[0] == "TWITTER_URL_V1") {
        json[prop].match[0] = TWITTER_URL_V1;
      }
      if (json[prop].match[0] == "LINKEDIN_URL_V1") {
        json[prop].match[0] = LINKEDIN_URL_V1;
      }
      if (json[prop].match[0] == "FACEBOOK_URL_V1") {
        json[prop].match[0] = FACEBOOK_URL_V1;
      }
      if (json[prop].match[0] == "GENDER_V1") {
        json[prop].match[0] = GENDER_V1;
      }
      if (json[prop].match[0] == "PERCENTAGE_V1") {
        json[prop].match[0] = PERCENTAGE_V1;
      }

      if (json[prop].match[0] == "FULL_FILE_PATH_CSV_V1") {
        json[prop].match[0] = FULL_FILE_PATH_CSV_V1;
      }
      if (json[prop].match[0] == "DATE_V1") {
        json[prop].match[0] = DATE_V1;
      }
      if (json[prop].match[0] == "DUNS_NUM_V1") {
        json[prop].match[0] = DUNS_NUM_V1;
      }
      if (json[prop].match[0] == "YEAR_V1") {
        json[prop].match[0] = YEAR_V1;
      }
      if (json[prop].match[0] == "UK_POSTCODE_V1") {
        json[prop].match[0] = UK_POSTCODE_V1;
      }

      if (json[prop].match[0] == "UK_NI_NUMBER_V1") {
        json[prop].match[0] = UK_NI_NUMBER_V1;
      }
      if (json[prop].match[0] == "UK_BANK_SORTCODE_V1") {
        json[prop].match[0] = UK_BANK_SORTCODE_V1;
      }
      if (json[prop].match[0] == "UK_BANK_ACCOUNT") {
        json[prop].match[0] = UK_BANK_ACCOUNT;
      }
      if (json[prop].match[0] == "UK_MOBILE_V1") {
        json[prop].match[0] = UK_MOBILE_V1;
      }
      if (json[prop].match[0] == "UK_PHONE_V1") {
        json[prop].match[0] = UK_PHONE_V1;
      }

      if (json[prop].match[0] == "UK_CAR_REG_V1") {
        json[prop].match[0] = UK_CAR_REG_V1;
      }
      if (json[prop].match[0] == "UK_CAR_REG_V2") {
        json[prop].match[0] = UK_CAR_REG_V2;
      }
      if (json[prop].match[0] == "UK_VATREGNO_V1") {
        json[prop].match[0] = UK_VATREGNO_V1;
      }
      if (json[prop].match[0] == "UK_COMPANYNAME_V1") {
        json[prop].match[0] = UK_COMPANYNAME_V1;
      }
      if (json[prop].match[0] == "UK_COMPANY_REG_V1") {
        json[prop].match[0] = UK_COMPANY_REG_V1;
      }
      if (json[prop].match[0] == "NHS_HOSPITAL_NUM_V1") {
        json[prop].match[0] = NHS_HOSPITAL_NUM_V1;
      }
      if (json[prop].match[0] == "UK_DRIVING_LICENCE_V1") {
        json[prop].match[0] = UK_DRIVING_LICENCE_V1;
      }
    }
  } */

  /* var fixed = {
    applicationID: { type: "String" },
    appId: {
      type: mongoose.Schema.ObjectId,
      ref: "App",
      required: true,
    },

    areaName: { type: "String" },
    area: {
      type: mongoose.Schema.ObjectId,
      ref: "Area",
      required: true,
    },

    branchName: { type: "String" },
    branch: {
      type: mongoose.Schema.ObjectId,
      ref: "Branch",
      required: true,
    },
    companyName: { type: "String" },
    company: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: "Date",
      default: Date.now,
    },
  }; */

  /*  scmc = [];
  scmc.push(json);
  scmc.push(fixed);
  const DataSchema = new mongoose.Schema(scmc);
  const myData = mongoose.model(req.body.appplicationID, DataSchema); */

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
