const advancedCreate = (model, app, BusinessRole) => async (req, res, next) => {
  const ErrorResponse = require("../utils/errorResponse");

  const Company = require("../models/orgSetup/Company");
  const Branch = require("../models/orgSetup/Branch");
  const Area = require("../models/orgSetup/Area");
  const User = require("../models/access/User");
  const App = require("../models/appSetup/App");

  // Get Login User Details

  const userRecord = await User.findById(req.user.id);
  let mydata = { ...req.body };
  req.body = {};
  req.body.appdata = mydata;
  req.body.user = req.user.id;
  req.body.role = userRecord.role;
  req.body.userName = userRecord.name;
  req.body.userEmail = userRecord.email;
  console.log("User:", req.body.user);

  // Get business Role
  req.body.businessRole = BusinessRole;
  console.log("BusinessRole:", req.body.businessRole);

  // Get App Details
  const BodyApp = await App.findOne({ applicationID: app });
  req.body.appId = BodyApp.id;
  req.body.applicationId = app;
  console.log("App:", req.body.appId);

  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID`, 400));
  }

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

  results = await model.create(req.body);

  //results = req.body;
  res.advancedCreate = {
    success: true,
    count: results.length,
    data: results,
  };
  next();
};

module.exports = advancedCreate;
