const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");
// const NumberRange = require("../../models/appSetup/NumberRange");
const { sendErrorMessage, notifiyMessanger } = require("../../modules/config2");
const {
  getPVConfig,
  getPVQuery,
  getNewConfig,
  createDocument,
  getApplication,
  findOneUpdateData,
  findOneAppData,
  collectExceptionFields,
  handleArray,
  tableFields,
  tableValidate,
  processingLog,
  actionLog,
  generateID,
  getDateValues,
  getInitialValues,
} = require("../../modules/config");
const { checkMultiAttachments } = require("../../modules/moduleValidate");
const calfunction = require("../../models/utilities/calfunction.js");

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.addDataRecords = asyncHandler(async (req, res, next) => {
  // 01 - Reserve user Inputs
  let userInputs = { ...req.body };

  // 02 - Number Range...

  numberRange =
    req.headers.numberRange != undefined ? req.headers.numberRange : "Internal";
  console.log("numberRange", numberRange);
  // if (req.headers.numberRange != undefined) {
  //   numberRange = req.headers.numberRange;
  // } else {
  //   numberRange = "Internal";
  // }
  // Check MultiAttachments Tag
  req.body.MultiAttachments = checkMultiAttachments(req.body.MultiAttachments);

  //Get Company
  const BodyApp = await getApplication(req.headers.applicationid);
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

  // Read New Config File
  var configFile = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  // Initial values
  var ivalue = getInitialValues(
    req.headers.applicationid,
    req.headers.businessrole,
    req.user
  );
  let ival_out = [];
  let ival = {};
  let out = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }
  // Set Partner field
  if (configFile.Controls.hasOwnProperty("Partner")) {
    if (configFile.Controls.Partner == "@user") {
      req.body.Partner = req.user.email;
    }
    if (
      configFile.Controls.Partner == "@VendorEmail" &&
      req.body.VendorEmail != undefined
    ) {
      req.body.Partner = req.body.VendorEmail;
    }
  }
  // ---------------------------------
  // Get Company Details and Validate
  // ---------------------------------
  const CompanyDetails = await Company.findById(req.user.company);
  // Company Validation
  err1 = sendErrorMessage("company", req.user.company, req.user.email);
  if (err1) {
    return next(err1);
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
    err1 = sendErrorMessage("branch", req.user.branch, req.user.email);
    if (err1) {
      return next(err1);
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

  /// Possible values..
  pvappconfig = getPVConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  qPV = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvappconfig
  );
  let resPV = await qPV;

  // Update data values example @currentDate
  for (const key in req.body) {
    req.body[key] = getDateValues(req.body[key]);
    // Possible values..
    for (let j = 0; j < configFile["PossibleValues"].length; j++) {
      if (configFile["PossibleValues"][j] == key) {
        console.log("PossibleValues", key);
        for (let p = 0; p < resPV.length; p++) {
          if (
            resPV[p]["PossibleValues"] == key &&
            resPV[p]["Description"] == req.body[key]
          ) {
            console.log(
              "PossibleValues",
              key,
              resPV[p]["Value"],
              resPV[p]["Description"]
            );
            req.body[key] = resPV[p]["Value"];
          }
        }
      }
    }
  }

  // add initial values if user as not provided it..
  for (let a = 0; a < ival_out.length; a++) {
    for (let b = 0; b < configFile["FieldDef"].length; b++) {
      if (configFile["FieldDef"][b]["name"] == ival_out[a]["Field"]) {
        if (!req.body.hasOwnProperty(ival_out[a]["Field"])) {
          //       } else {
          req.body[ival_out[a]["Field"]] = ival_out[a]["Value"];
          console.log(
            "User default value added for:",
            ival_out[a]["Field"],
            ival_out[a]["Value"]
          );
        }
      }
    }
  }
  // Handle OCR data
  if (req.body["carouselImage_ocr"] != undefined) {
    i = 0;
    for (let p = 0; p < req.body["carouselImage_ocr"].length; p++) {
      req.body["carouselImage_ocr"][p]["ItemNumber"] = i + 1;
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
    mydata.TransLog = req.body.TransLog;
    for (const key in req.body) {
      configFile["FieldDef"].forEach((element1) => {
        if (req.body.hasOwnProperty(key) & (element1["SLabel"] == key)) {
          mydata[element1["name"]] = req.body[key];
        }
      });
    }
  }
  req.body = mydata;
  // Find Exception fields
  myFieldArray = collectExceptionFields(configFile.FieldDef);

  for (const key in req.body) {
    if (req.body.hasOwnProperty(key)) {
      var resField = myFieldArray.includes(key);
      /// Header Validations....
      if (resField === false) {
        return next(
          new ErrorResponse(
            `Header Field # ${key} can't be used with this transaction`,
            400
          )
        );
      }
    }
  }
  /////--------------------------------------------------
  /// Calculate ID

  req.body = await generateID(
    req.headers.buttonname,
    req.body,
    configFile.MButtons,
    numberRange,
    req
  );
  if (req.body.ReferenceID == undefined || req.body.ReferenceID == "") {
    req.body.ReferenceID = req.body.ID;
  }

  /// X99 - Update Processing Log.....
  // Processing Log
  req.body.TransLog = processingLog(
    req.body.ID,
    "CREATE",
    req.body.user,
    req.body.userName,
    req.body.Status,
    req.body.applicationId,
    "New document created",
    req.headers.buttontype,
    req.headers.buttonname,
    req.body.ProgressComment
  );
  req.body["actionLog"] = [];
  req.body.actionLog = actionLog(
    req,
    "CREATE",
    req.body["actionLog"],
    req.headers.buttontype,
    req.headers.buttonname,
    userInputs,
    configFile.FieldDef
  );

  /// X99 - Update Calculations.....
  let tblFields = tableFields(configFile.FieldDef);
  if (tblFields.length > 0) {
    for (let l = 0; l < tblFields.length; l++) {
      if (req.headers.calculation == "Yes") {
        var Handler = new calfunction();
        console.log("CREATE - Table calculation starts..");
        outdata = Handler["tablecalculation"](
          req.body,
          configFile["CalculatedFields"],
          tblFields[l],
          configFile["FieldDef"]
        );
        console.log("CREATE - Table calculation completed..");
        req.body = outdata;
        //  req.body = outdata;
      }
    }
  } else {
    if (req.headers.calculation == "Yes") {
      var Handler = new calfunction();
      console.log("CREATE - Header calculation starts..");
      mydata = Handler["headercalculation"](
        mydata,
        configFile["CalculatedFields"],
        configFile["FieldDef"]
      );
      console.log("CREATE - Header calculation completed..");
    }
  }

  // X99 - Validations.....
  console.log("CREATE - Validation starts..");
  var mydata1 = mydata;
  for (const obj in mydata1) {
    var Handler = new calfunction();
    var type = Handler["fieldType"](obj, configFile["FieldDef"]);
    if (type == "Array") {
      if (mydata[obj] != undefined) {
        for (var ii = 0; ii < mydata[obj].length; ii++) {
          var passArray = {};
          //added by atul - Start
          if (configFile["tableConfig"][obj] != undefined) {
            if (configFile["tableConfig"][obj].hasOwnProperty("Validations")) {
              passArray["fieldName"] = obj;
              passArray["data"] = mydata;
              passArray["config"] =
                configFile["tableConfig"][obj]["Validations"];
              passArray["FieldDef"] = configFile["FieldDef"].concat(
                configFile["tableConfig"][obj]["ItemFieldDefinition"]
              );
              passArray["itemCnt"] = ii;
              var sValidation = Handler["validation"](passArray);
              mydata = sValidation["data"];
              if (sValidation["status"] == false) {
                res.status(400).json({
                  message: sValidation["message"],
                  success: false,
                  fieldValue: sValidation["fieldValue"],
                });
                return false;
              }
            }
          }
        }
      }
    } else {
      var passArray = {};
      passArray["fieldName"] = obj;
      passArray["data"] = mydata;
      passArray["config"] = configFile["Validations"];
      passArray["FieldDef"] = configFile["FieldDef"];
      passArray["itemCnt"] = "";
      var sValidation = Handler["validation"](passArray);
      mydata = sValidation["data"];
      if (sValidation["status"] == false) {
        res.status(400).json({
          message: sValidation["message"],
          success: false,
          fieldValue: mydata[obj],
        });
      }
    }
  }
  console.log("CREATE - Validation ends..");
  // Process Flow
  mydata["selfNode"] = [];
  if (configFile["Controls"]["processflow"] != undefined) {
    console.log("NewCreate with Process Flow");
    console.log("ProcessFlow", configFile["Controls"]["processflow"]);
    pflow_self = configFile["Controls"]["processflow"]["config"];
    sNode = {};
    sNode["id"] = mydata["ID"];
    sNode["fromApp"] = mydata["applicationId"];
    sNode["lane"] = pflow_self["fieldMap"]["lane"];
    sNode["title"] = pflow_self["fieldMap"]["title"].replace(
      "@ID",
      mydata["ID"]
    );
    sNode["titleAbbreviation"] = pflow_self["fieldMap"]["titleAbbreviation"];
    sNode["state"] = pflow_self["fieldMap"]["state"];
    sNode["stateText"] = pflow_self["fieldMap"]["stateText"];
    sNode["focused"] = pflow_self["fieldMap"]["focused"];
    sNode["highlighted"] = pflow_self["fieldMap"]["highlighted"];
    sNode["texts"] = [];
    sNode["texts"].push(pflow_self["fieldMap"]["text1"]);
    sNode["texts"].push(pflow_self["fieldMap"]["text2"]);

    var qView = JSON.stringify(
      configFile["Controls"]["processflow"]["attributes"]
    );
    for (let j = 0; j < configFile["FieldDef"].length; j++) {
      repString = "@" + configFile["FieldDef"][j]["name"];
      console.log(repString);
      qView = qView.replace(
        repString,
        mydata[configFile["FieldDef"][j]["name"]]
      );
    }
    sNode["quickView"] = JSON.parse(qView);

    sNode["children"] = [];
    mydata["selfNode"].push({ ...sNode });
    sNode = {};
  }

  // Perform Document Checks..
  mydata["checks"] = [];
  chk = {};
  if (configFile["Checks"] != undefined) {
    for (let k = 0; k < configFile["Checks"]["Header"].length; k++) {
      fieldName = configFile["Checks"]["Header"][k]["Field"];
      fieldValue = configFile["Checks"]["Header"][k]["Value"];
      x1 = [];
      switch (configFile["Checks"]["Header"][k]["Operator"]) {
        case "EQ":
          console.log(fieldName, mydata[fieldName]);
          if (fieldValue == [] || fieldValue == "") {
            if (
              mydata[fieldName] == fieldValue ||
              mydata[fieldName] == undefined
            ) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          } else {
            if (mydata[fieldName] == fieldValue) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          }
          break;
        case "COUNT":
          if (mydata[fieldName] == undefined) {
            mydata[fieldName] = [];
          }
          if (mydata[fieldName].length == fieldValue) {
            X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
          } else {
            X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
          }

          break;
        default:
          X1 =
            "SETUP-FAIL-999-There is a Setup issue for (" +
            configFile["Checks"]["Header"][k]["Operator"] +
            ")";
          X1 = X1.split("-");
          break;
      }
      chk["Type"] = X1[0];
      chk["ItemStatus"] = X1[1];
      chk["Number"] = X1[2];
      chk["Message"] = X1[3];
      chk["checkDate"] = new Date();
      chk["checkStage"] = "Create Record";
      chk["buttonType"] = req.headers.buttontype;
      chk["buttonName"] = req.headers.buttonname;
      mydata["checks"].push({ ...chk });
      chk = {};
    }
  }

  // X99 - Create Record [mongoDB].....
  let result = {};
  result = await createDocument(req.headers.applicationid, mydata);
  mydata = {};

  // X99 - Send Notification .....
  var Notification;
  var msg =
    "SUCCESS: " +
    configFile["Title"]["ApplicationTitle"] +
    " is created with ID: " +
    result["ID"] +
    ", by User: " +
    req.user.email;
  // FB Messenger
  if (req.headers.notification == "Messenger") {
    // Read Tokens
    let fx = "../../bot/messengerToken.json";
    var messengerToken = require(fx);
    if (messengerToken[req.headers.businessrole] != undefined) {
      console.log("CREATE - Messenger Notification..");
      sendNotification = notifiyMessanger(
        req.user.email,
        req.headers.businessrole,
        msg,
        "Text",
        "facebook",
        messengerToken[req.headers.businessrole]
      );
    }
  }

  res.status(200).json({
    message: "New record created",
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
  let userInputs = { ...req.body };
  // 01 - Check if applicationid is provided
  if (!req.headers.applicationid) {
    console.log("Please provide App ID(Header)", req.headers.applicationid);
    return next(new ErrorResponse(`Please provide App ID(Header)`, 400));
  }

  // 01B - Find App record
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });

  // 02 - Check if businessrole is provided
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }

  // 02 - Check if mode is provided
  if (!req.headers.mode) {
    return next(new ErrorResponse(`Please provide update mode`, 400));
  }

  // 03 - Read New Config File
  var configFile = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  // 04 - Find Exception fields
  myFieldArray = collectExceptionFields(configFile.FieldDef);

  // 05 - Get and validate - Company Details
  const CompanyDetails = await Company.findById(req.user.company);
  err1 = sendErrorMessage("company", req.user.company, req.user.email);
  if (err1) {
    return next(err1);
  }

  // 06 - Validation : Check if user is creating documents in their own company (Pass)
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
  // Great - Company validation passed, now USER company can be used!!

  // 07 - Set body fields
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;
  req.body.user = req.user.id;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;
  req.body.company = CompanyDetails.id;
  req.body.companyName = CompanyDetails.companyName;

  /// Possible values..
  pvappconfig = getPVConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  qPV = getPVQuery(
    req.headers.applicationid,
    req.headers.businessrole,
    pvappconfig
  );
  let resPV = await qPV;

  // Update data values example @currentDate
  for (const key in req.body) {
    //    req.body[key] = getDateValues(req.body[key]);
    // Possible values..
    for (let j = 0; j < configFile["PossibleValues"].length; j++) {
      if (configFile["PossibleValues"][j] == key) {
        console.log("PossibleValues", key);
        for (let p = 0; p < resPV.length; p++) {
          if (
            resPV[p]["PossibleValues"] == key &&
            resPV[p]["Description"] == req.body[key]
          ) {
            console.log(
              "PossibleValues",
              key,
              resPV[p]["Value"],
              resPV[p]["Description"]
            );
            req.body[key] = resPV[p]["Value"];
          }
        }
      }
    }
  }

  // 08 - Get Branch from Header
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

  // 09 - Get Area from Body
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
    err1 = sendErrorMessage("branch", req.user.branch, req.user.email);
    if (err1) {
      return next(err1);
    }
  }
  // If user record has got Branch then validate it matches with body Branch
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
  if (req.headers.updateiv == "Yes") {
    // X2 - Initial values
    var ivalue = getInitialValues(
      req.headers.applicationid,
      req.headers.businessrole,
      req.user
    );
    let ival_out = [];
    let ival = {};
    let out = {};
    for (let i = 0; i < ivalue.length; i++) {
      ival = {};
      const element = ivalue[i];
      ival = { ...element };
      o_val = getDateValues(ival.Value);
      ival.Value = o_val;
      ival_out.push(ival);
    }
    // X3 - Update data values example @currentDate
    for (const key in req.body) {
      req.body[key] = getDateValues(req.body[key]);
    }

    // X4 - Add initial values / user defaults in the body if user as not provided it..
    for (let a = 0; a < ival_out.length; a++) {
      for (let b = 0; b < configFile["FieldDef"].length; b++) {
        if (configFile["FieldDef"][b]["name"] == ival_out[a]["Field"]) {
          if (!req.body.hasOwnProperty(ival_out[a]["Field"])) {
            //    } else {
            req.body[ival_out[a]["Field"]] = ival_out[a]["Value"];
            console.log(
              "User default value added for:",
              ival_out[a]["Field"],
              ival_out[a]["Value"]
            );
          }
        }
      }
    }
  }

  // X5 - Update Processing Log
  let Status = "";
  if (req.body.Status) {
    Status = req.body.Status;
  } else {
    Status = "NoChange";
  }
  req.body.TransLog = processingLog(
    req.body.ID,
    "UPDATE",
    req.body.user,
    req.body.userName,
    Status,
    req.body.applicationId,
    "UPDATE",
    req.headers.buttontype,
    req.headers.buttonname,
    req.body.ProgressComment
  );

  // X6 - Read the record
  let myData = await findOneAppData(req.body.ID, req.body.applicationId);
  if (!myData) {
    return next(new ErrorResponse(`Record with ${req.body.ID} Not found`, 400));
  }

  // Handle Carousel Image data (add to existing)
  if (req.body["carouselImage"] != undefined) {
    for (let m = 0; m < myData["carouselImage"].length; m++) {
      console.log("File", myData["carouselImage"][m]);
      req.body["carouselImage"].unshift(myData["carouselImage"][m]);
    }
  }
  // Handle OCR data
  if (req.body["carouselImage_ocr"] != undefined) {
    i = 0;
    for (let p = 0; p < req.body["carouselImage_ocr"].length; p++) {
      i = i + 1;
      req.body["carouselImage_ocr"][p]["ItemNumber"] = i;
    }
    for (let m = 0; m < myData["carouselImage_ocr"].length; m++) {
      i = i + 1;
      myData["carouselImage_ocr"][m]["ItemNumber"] = i;
      // req.body["carouselImage_ocr"].unshift(myData["carouselImage_ocr"][m]);
      req.body["carouselImage_ocr"].push(myData["carouselImage_ocr"][m]);
    }
  }

  // X7 - Update T-Log
  myData.TransLog.unshift(req.body.TransLog);
  req.body.TransLog = myData.TransLog;
  myData.actionLog = actionLog(
    req,
    "UPDATE",
    myData["actionLog"],
    req.headers.buttontype,
    req.headers.buttonname,
    userInputs,
    configFile.FieldDef
  );
  req.body.actionLog = myData.actionLog;

  // X8 - MultiAttachment Logic...
  if (req.body.hasOwnProperty("MultiAttachments")) {
    if (req.body["MultiAttachments"]) {
      if (myData["MultiAttachments"]) {
        if (myData["MultiAttachments"]["items"]) {
          console.log("Multiple Attachments");
          req.body["MultiAttachments"]["items"] = handleArray(
            req.body["MultiAttachments"]["items"][0],
            myData["MultiAttachments"]["items"]
          );
          myData["MultiAttachments"] = req.body["MultiAttachments"];
        } else {
          console.log("Single Attachments");
          myData["MultiAttachments"] = req.body["MultiAttachments"];
        }
      } else {
        console.log("Single Attachments - No Tag");
        myData["MultiAttachments"] = req.body["MultiAttachments"];
      }
    }
  }
  //Process Flow
  if (req.body.lowerNodes != undefined) {
    console.log(req.body.lowerNodes, myData.lowerNodes);
    myData.lowerNodes.push(req.body.lowerNodes[0]);
    req.body.lowerNodes = myData.lowerNodes;
  }
  // X8 - Update Table Data
  let tblFields = tableFields(configFile.FieldDef);
  for (const kk in req.body) {
    let tableField = false;
    tableField = tblFields.includes(kk);
    if (tableField == true && kk != "actionLog") {
      console.log("Table:", kk);
      myData[kk] = tableValidate(req.body[kk], myData[kk]);
      req.body[kk] = myData[kk];
    } else {
      //     console.log("NoTable", kk);
      myData[kk] = req.body[kk];
    }
  }
  if (tblFields.length > 0) {
    // X8 - Perform Calculations [Table] ...
    for (let l = 0; l < tblFields.length; l++) {
      if (req.headers.calculation == "Yes") {
        console.log("UPDATE - Table Calculation Starts..", tblFields[l]);
        var Handler = new calfunction();
        outdata = Handler["tablecalculation"](
          myData,
          configFile["CalculatedFields"],
          tblFields[l],
          configFile["FieldDef"]
        );
        console.log("UPDATE - Table Calculation Ends..", tblFields[l]);
        req.body = outdata;
        myData = outdata;
      } else {
        console.log("UPDATE - Calculation not reqiuired..");
      }
    }
  } else {
    // X8 - Perform Calculations [Header] ...
    if (req.headers.calculation == "Yes") {
      var Handler = new calfunction();
      console.log("UPDATE - Header Calculation Starts..");
      outdata = Handler["headercalculation"](
        req.body,
        configFile["CalculatedFields"],
        configFile["FieldDef"]
      );
      console.log("UPDATE - Header Calculation Ends..");
      req.body = outdata;
    }
  }

  // X8 - Perform Validations ...
  console.log("UPDATE - Validation starts..");
  var mydata1 = req.body;
  for (const obj in mydata1) {
    var Handler = new calfunction();
    var type = Handler["fieldType"](obj, configFile["FieldDef"]);
    if (type == "Array") {
      if (req.body[obj] != undefined) {
        for (var ii = 0; ii < req.body[obj].length; ii++) {
          var passArray = {};
          //added by atul - Start
          if (configFile["tableConfig"][obj].hasOwnProperty("Validations")) {
            passArray["fieldName"] = obj;
            passArray["data"] = req.body;
            passArray["config"] = configFile["tableConfig"][obj]["Validations"];
            passArray["FieldDef"] = configFile["FieldDef"].concat(
              configFile["tableConfig"][obj]["ItemFieldDefinition"]
            );
            passArray["itemCnt"] = ii;
            var sValidation = Handler["validation"](passArray);
            req.body = sValidation["data"];
            if (sValidation["status"] == false) {
              res.status(400).json({
                message: sValidation["message"],
                success: false,
                fieldValue: sValidation["fieldValue"],
              });
              return false;
            }
          }
        }
      }
    } else {
      var passArray = {};
      passArray["fieldName"] = obj;
      passArray["data"] = req.body;
      passArray["config"] = configFile["Validations"];
      passArray["FieldDef"] = configFile["FieldDef"];
      passArray["itemCnt"] = "";
      var sValidation = Handler["validation"](passArray);
      req.body = sValidation["data"];
      if (sValidation["status"] == false) {
        res.status(400).json({
          message: sValidation["message"],
          success: false,
          fieldValue: req.body[obj],
        });
      }
    }
  }
  console.log("UPDATE - Validation ends..");

  // X8 - Set Ref ID ...
  if (req.body.ReferenceID == undefined || req.body.ReferenceID == "") {
    req.body.ReferenceID = req.body.ID;
  }

  // Perform Document Checks..
  req.body["checks"] = [];
  console.log("Perform Document Checks..1");
  chk = {};
  X1 = [];
  if (configFile["Checks"] != undefined) {
    console.log("Perform Document Checks..2");
    appRec = await findOneAppData(req.body.ID, req.headers.applicationid);
    for (let k = 0; k < configFile["Checks"]["Header"].length; k++) {
      fieldName = configFile["Checks"]["Header"][k]["Field"];
      fieldValue = configFile["Checks"]["Header"][k]["Value"];
      console.log("Checks..", fieldName, fieldValue);
      switch (configFile["Checks"]["Header"][k]["Operator"]) {
        case "EQ":
          console.log(fieldName, req.body[fieldName]);
          if (fieldValue == [] || fieldValue == "") {
            if (req.body[fieldName] == undefined) {
              if (
                appRec[fieldName] == fieldValue ||
                appRec[fieldName] == undefined
              ) {
                X1 = configFile["Checks"]["Header"][k]["trueMessage"].split(
                  "-"
                );
              } else {
                X1 = configFile["Checks"]["Header"][k]["falseMessage"].split(
                  "-"
                );
              }
            } else {
              if (req.body[fieldName] == fieldValue) {
                X1 = configFile["Checks"]["Header"][k]["trueMessage"].split(
                  "-"
                );
              } else {
                X1 = configFile["Checks"]["Header"][k]["falseMessage"].split(
                  "-"
                );
              }
            }
          } else {
            if (req.body[fieldName] == undefined) {
              if (appRec[fieldName] == fieldValue) {
                X1 = configFile["Checks"]["Header"][k]["trueMessage"].split(
                  "-"
                );
              } else {
                X1 = configFile["Checks"]["Header"][k]["falseMessage"].split(
                  "-"
                );
              }
            } else {
              if (req.body[fieldName] == fieldValue) {
                X1 = configFile["Checks"]["Header"][k]["trueMessage"].split(
                  "-"
                );
              } else {
                X1 = configFile["Checks"]["Header"][k]["falseMessage"].split(
                  "-"
                );
              }
            }
          }
          break;
        case "COUNT":
          if (req.body[fieldName] == undefined) {
            if (appRec[fieldName] == undefined) {
              appRec[fieldName] = [];
            } else {
              if (appRec[fieldName].length == fieldValue) {
                X1 = configFile["Checks"]["Header"][k]["trueMessage"].split(
                  "-"
                );
              } else {
                X1 = configFile["Checks"]["Header"][k]["falseMessage"].split(
                  "-"
                );
              }
            }
          } else {
            if (req.body[fieldName].length == fieldValue) {
              X1 = configFile["Checks"]["Header"][k]["trueMessage"].split("-");
            } else {
              X1 = configFile["Checks"]["Header"][k]["falseMessage"].split("-");
            }
          }
          break;
        default:
          X1 =
            "SETUP-FAIL-999-There is a Setup issue for (" +
            configFile["Checks"]["Header"][k]["Operator"] +
            ")";
          X1 = X1.split("-");
          break;
      }
      chk["Type"] = X1[0];
      chk["ItemStatus"] = X1[1];
      chk["Number"] = X1[2];
      chk["Message"] = X1[3];
      chk["checkDate"] = new Date();
      chk["checkStage"] = "Document Update";
      chk["buttonType"] = req.headers.buttontype;
      chk["buttonName"] = req.headers.buttonname;
      req.body["checks"].push({ ...chk });
      chk = {};
      X1 = [];
    }
  }

  // X8 - Update Record ...
  result = await findOneUpdateData(req.body, req.headers.applicationid);

  // X8 - Send Notification ...
  var Notification;
  var msg =
    "SUCCESS: " +
    configFile["Title"]["ApplicationTitle"] +
    " is updated for ID: " +
    result["ID"] +
    ", by User: " +
    req.user.email;
  Notification = req.headers.notification;
  if (req.headers.notification == "Messenger") {
    // Read Color Configuration
    let fx = "../../bot/messengerToken.json";
    var messengerToken = require(fx);
    if (messengerToken[req.headers.businessrole] != undefined) {
      console.log("UPDATE - Messenger Notification..");
      sendNotification = notifiyMessanger(
        req.user.email,
        req.headers.businessrole,
        msg,
        "Text",
        "facebook",
        messengerToken[req.headers.businessrole]
      );
    }
  }
  res.status(200).json({
    message: "Record updated",
    success: true,
    data: result,
  });
});
