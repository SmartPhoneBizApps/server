const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Company = require("../../models/orgSetup/Company");
const Branch = require("../../models/orgSetup/Branch");
const Area = require("../../models/orgSetup/Area");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
const { getCreateMap, getNewConfig } = require("../../modules/config");
//const { createRecord } = require("../../modules/validations/validations");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");
const calfunction = require("../../models/utilities/calfunction.js");

// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.addWithRef = asyncHandler(async (req, res, next) => {
  /// --------------------------------- ///
  ///        Get inputs ..........
  /// --------------------------------- ///

  // Get App from Header
  const S_BodyApp = await App.findOne({
    applicationID: req.headers.s_applicationid,
  });
  const T_BodyApp = await App.findOne({
    applicationID: req.headers.t_applicationid,
  });
  req.body.appId = T_BodyApp.id;
  req.body.applicationId = req.headers.t_applicationid;
  req.body.user = req.user.id;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;
  if (!req.headers.s_applicationid) {
    return next(new ErrorResponse(`Please provide Source App ID(Header)`, 400));
  }
  if (!req.headers.t_applicationid) {
    return next(new ErrorResponse(`Please provide Target App ID(Header)`, 400));
  }
  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessRole,
  });
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  if (!req.headers.transaction) {
    return next(
      new ErrorResponse(`Please provide Transaction type(Header)`, 400)
    );
  }
  var mymap = getCreateMap(
    req.headers.s_applicationid,
    req.headers.t_applicationid
  );
  myInv = {};
  myInv = req.body;
  // Set InputValues
  mymap.Inputs.forEach((el1) => {
    if (!req.body[el1]) {
      return next(new ErrorResponse(`Input Field ${el1} missing (Body)`, 400));
    } else {
      myInv[el1] = req.body[el1];
    }
  });
  // Get Parent App data
  const source = await SUPP00018.find({ ID: req.body["ID"] });
  //myInv = setHeader(source, myInv, mymap);
  for (const key in mymap.HeaderMap) {
    for (let index = 0; index < source.length; index++) {
      const el2 = source[index];
      myInv[key] = el2[key];
    }
  }
  for (
    let index = 0;
    index < mymap["Conversion"]["ID"]["Fields"].length;
    index++
  ) {
    const ex = mymap["Conversion"]["ID"]["Fields"][index];
    if (index == 0) {
      myInv["ID"] = myInv[ex];
    } else {
      myInv["ID"] = myInv["ID"] + myInv[ex];
    }
  }
  itemdata = [];
  items = {};

  for (let index = 0; index < source.length; index++) {
    for (const key in source[index]["ItemData"]) {
      for (const k6 in source[index]["ItemData"][key]) {
        items["ID"] = myInv["ID"];
        for (const ik in mymap["ItemMap"]) {
          if (k6 == mymap["ItemMap"][ik]) {
            items[ik] = source[index]["ItemData"][key][k6];
          }
        }
      }
      itemdata.push(items);
      items = {};
    }
  }
  myInv["ItemData"] = itemdata;
  // Read New Config File
  var cardConfig = getNewConfig(
    req.headers.t_applicationid,
    req.headers.businessrole
  );
  console.log("Config", cardConfig);
  for (const kk in mymap.Conversion) {
    if (mymap.Conversion.hasOwnProperty(kk)) {
      const element = mymap.Conversion[kk];
    }
  }
  result = {};
  //---------------------------
  // Perform Calculations ....
  //---------------------------
  if (req.headers.calculation == "Yes") {
    var Handler = new calfunction();
    myInv = Handler["datacalculation"](myInv, cardConfig["CalculatedFields"]);
  }
  //---------------------------

  //result = createRecord(req.headers.t_applicationid);
  result = await SUPP00028.create(myInv);
  result = await SUPP00028_Itm.create(myInv.ItemData);
  mydata = {};
  res.status(201).json({
    success: true,
    data: myInv,
    //  items: result2,
  });
});
