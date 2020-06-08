const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
const {
  getNewConfig,
  createDocument,
  getCompany,
  getRole,
  itemValidate,
  findAndUpdateItem,
  findOneUpdateData,
  findOneAppData,
  collectExceptionFields,
} = require("../../modules/config");

const { valAppNotNull } = require("../../modules/validationMessages");

const calfunction = require("../../models/utilities/calfunction.js");
const Possval = require("../../models/appSetup/Possval");

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.addDataRecords = asyncHandler(async (req, res, next) => {
  //Get Company
  const BodyApp = await getCompany(req.headers.applicationid);
  const BusinessRole = await getRole(req.headers.businessRole);
  // Read New Config File
  var cardConfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
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
          mydata[element1["name"]] = req.body[key];
        }
      });
    }
  }
  req.body = mydata;
  // Find Exception fields
  myFieldArray = collectExceptionFields(cardConfig.FieldDef);

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      var resField = myFieldArray.includes(key);
      /// Header Validations....
      if (resField === false && key !== "ItemData") {
        return next(
          new ErrorResponse(
            `Header Field # ${key} can't be used with this transaction`,
            400
          )
        );
      }
      /// Item Validations....
      if (key === "ItemData") {
        myItemArray = [];
        for (
          let index = 0;
          index < cardConfig.itemConfig.ItemFieldDefinition.length;
          index++
        ) {
          const element2 =
            cardConfig.itemConfig.ItemFieldDefinition[index].name;
          myItemArray.push(element2);
        }
        for (const key2 in req.body.ItemData) {
          for (const key3 in req.body.ItemData[key2]) {
            if (req.body.ItemData[key2].hasOwnProperty(key3)) {
              const element3 = req.body.ItemData[key2][key3];
              var resItemField = myItemArray.includes(key3);
              /// Item Validations....
              if (
                resItemField === false &&
                key3 !== "Edit" &&
                key3 !== "Display" &&
                key3 !== "Delete"
              ) {
                return next(
                  new ErrorResponse(
                    `Item Field ${key3} can't be used with this transaction`,
                    400
                  )
                );
              }
            }
          }
        }
      }
    }
  }
  //---------------------------
  // Perform Calculations ....
  //---------------------------
  if (req.headers.calculation == "Yes") {
    var Handler = new calfunction();
    mydata = Handler["datacalculation"](mydata, cardConfig["CalculatedFields"]);
  }
  // Create data in mongo DB ...
  let result = {};
  let result2 = {};
  result = await createDocument(req.headers.applicationid, mydata);
  if (mydata.ItemData) {
    app_itm = req.headers.applicationid + "_Itm";
    result2 = await createDocument(app_itm, mydata.ItemData);
  }
  mydata = {};
  // Send Response .....
  res.status(200).json({
    success: true,
    data: result,
  });
});
// -----------------------------------------------------
// -----------------------------------------------------
// @desc      Update record
// @route     POST /api/v1/datarecords/
// @access    Private
// -----------------------------------------------------
// -----------------------------------------------------
exports.updateDataRecords = asyncHandler(async (req, res, next) => {
  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID(Header)`, 400));
  }
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  // Read New Config File
  var cardConfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  // Find Exception fields
  myFieldArray = collectExceptionFields(cardConfig.FieldDef);

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      var resField = myFieldArray.includes(key);
      if (resField === false && key !== "ItemData") {
        return next(
          new ErrorResponse(`Field ${key} can't be used with this App`, 400)
        );
      }
    }
  }
  // -----------------------------------------------------
  // Get App from Header
  // -----------------------------------------------------
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessrole,
  });
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;

  req.body.user = req.user.id;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;
  // Get Company Details
  const CompanyDetails = await Company.findById(req.user.company);
  ///  +++++++++++  VALIDATIONS STARTS +++++++++++++++++++++++ /////////
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
  ///  +++++++++++  VALIDATIONS ENDS +++++++++++++++++++++++ /////////
  // -----------------------------------------------------
  // Processing Log
  // -----------------------------------------------------
  let pLog = {};
  let pg1 = [];
  if (req.headers.mode) {
    pLog["Type"] = "DATA_UPDATE";
  } else {
    return next(new ErrorResponse(`Please provide update mode`, 400));
  }
  pLog["User"] = req.body.user;
  pLog["UserName"] = req.body.userName;
  if (req.body.Status) {
    pLog["Status"] = req.body.Status;
  }
  pLog["TimeStamp"] = Date.now();
  pLog["ID"] = req.body.ID;
  pLog["applicationId"] = req.body.applicationId;
  pg1.push(pLog);
  req.body.TransLog = pLog;
  let nTrans = [];
  // -----------------------------------------------------
  // Read data from DB
  // -----------------------------------------------------
  let myData = await findOneAppData(req.body.ID, req.body.applicationId);
  // let myData = await SUPP00018.findOne({ ID: req.body.ID });
  if (!myData) {
    return next(new ErrorResponse(`Record with ${ID} Not found`, 400));
  }
  //---------------------------
  // Item update logic....
  //---------------------------
  if (req.body["ItemData"]) {
    myData["ItemData"] = itemValidate(req.body["ItemData"], myData["ItemData"]);
  }
  //---------------------------
  // Update Transaction Log
  //---------------------------
  myData.TransLog.forEach((ex1) => {
    nTrans.push(ex1);
  });
  nTrans.push(req.body.TransLog);
  req.body.TransLog = nTrans;
  req.body["ItemData"] = myData["ItemData"];
  //---------------------------
  // Perform Calculations ....
  //---------------------------
  if (req.headers.calculation == "Yes") {
    var Handler = new calfunction();
    outdata = Handler["datacalculation"](
      req.body,
      cardConfig["CalculatedFields"]
    );
    req.body = outdata;
  }
  //---------------------------
  result = await findOneUpdateData(req.body, req.headers.applicationid);
  console.log("Stage1", result, req.headers.applicationid, req.body);
  if (req.body["ItemData"]) {
    result2 = await findAndUpdateItem(
      req.body["ItemData"],
      req.headers.applicationid
    );
    console.log("Stage1", result2);
  }
  res.status(200).json({
    success: true,
    data: result,
  });
});
