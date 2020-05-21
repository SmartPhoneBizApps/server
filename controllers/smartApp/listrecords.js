const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const User = require("../../models/access/User");
const App = require("../../models/appSetup/App");
//const Employee = require("../../models/smartApp/Employee");
//const Education = require("../../models/smartApp/Education");
const Appschema = require("../../models/appSetup/Appschema");

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

const { sum } = require("../utilities/functions.js");
const { isEven } = require("../utilities/functions.js");
const { fcGetPossibleValues } = require("../utilities/functions.js");

const Possval = require("../../models/appSetup/Possval");

var sch = require("../../applicationJSON/Schema_Master.json");
var button = require("../../bot/Supplier_button.json");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getMaterListrecords = asyncHandler(async (req, res, next) => {
  outData = res.advancedMasterList;
  res.status(200).json(outData);
});

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getListrecords = asyncHandler(async (req, res, next) => {
  let outData = res.advancedDataList;
  let outData2 = outData;

  if (req.headers.possiblevalue == "Yes") {
    // Get Possible values
    /*     let results = {};
    results = fcGetPossibleValues(
      req.headers.applicationid,
      req.headers.businessrole
    ); */
    app1 = req.headers.applicationid;
    app2 = "GLOBAL";
    role1 = req.headers.businessrole;
    role2 = "ALL";
    const fields = "PossibleValues Value Description ColorSAP Score EditLock";
    const newPv =
      "../../PossibleValues/" +
      req.headers.applicationid +
      "_" +
      req.headers.businessrole +
      "_pv.json";
    var pvconfig1 = require(newPv);
    let query;

    query = Possval.find(
      {
        PossibleValues: { $in: pvconfig1.PossFields },
        ApplicationID: { $in: [app1, app2] },
        Role: { $in: [role1, role2] },
      },
      { _id: 0 }
    );
    query = query.select(fields);
    // Executing query
    let results = await query;
    buttonData = {};
    buttonVal = {};
    results.forEach((element) => {
      if (element.PossibleValues == "CurrentStatus") {
        for (const key in button[req.headers.applicationid][element.Value]) {
          if (
            button[req.headers.applicationid][element.Value].hasOwnProperty(key)
          ) {
            const element1 =
              button[req.headers.applicationid][element.Value][key];
            if (key == role1) {
              buttonData[element.Value] = element1;
            }
          }
        }
      }
      l1 = {};
      // Loop Data
      for (let index = 0; index < outData.data.length; index++) {
        const e1 = outData.data[index];
        for (const kl in outData.data[index]) {
          const e2 = outData.data[index][kl];
          //   l1[kl] = outData.data[index][kl];
          //  console.log("e2", e2);

          if (element.PossibleValues == kl && e2 == element.Value) {
            kx = element.PossibleValues + "_key";
            ky = element.PossibleValues + "State";
            l1["PossibleValues"] = element.PossibleValues;
            l1[element.PossibleValues] = element["Description"];
            //       console.log("Description:", element["Description"]);
            l1[kx] = element["Value"];
            l1[ky] = element["ColorSAP"];
            l1["EditLock"] = element["EditLock"];
            l1["Score"] = element["Score"];
            // console.log(l1);
            outData.data[index][kl][element.Value] = { ...l1 };
            //          console.log(outData2.data[index]);
          }
        }
      }
    });

    res.status(200).json({
      outData,
      possibleValues: results,
      buttons: buttonData,
    });
  } else {
    res.status(200).json({
      outData,
    });
  }
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
  const BodyApp = await App.findOne({ applicationID: req.body.appplicationID });
  req.body.appId = BodyApp.id;

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
      req.body.branch = userRecord.branch;
    }

    if (req.body.branch != userRecord.branch) {
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
      req.body.area = userRecord.area;
    }

    // if body and user both have area then they should be same (Validation  - Pass)
    if (req.body.area != userRecord.area) {
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
