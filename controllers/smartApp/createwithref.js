const asyncHandler = require("../../middleware/async");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");
const App = require("../../models/appSetup/App");
const { getCreateMap, getNewConfig } = require("../../modules/config");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.createwithref = asyncHandler(async (req, res, next) => {
  let outData = res.advancedDataList;

  if (!req.headers.applicationid) {
    return next(new ErrorResponse(`Please provide Source App ID(Header)`, 400));
  }
  if (!req.headers.applicationid2) {
    return next(new ErrorResponse(`Please provide Target App ID(Header)`, 400));
  }
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  if (!req.headers.transaction) {
    return next(
      new ErrorResponse(`Please provide Transaction type(Header)`, 400)
    );
  }
  const T_BodyApp = await App.findOne({
    applicationID: req.headers.applicationid2,
  });
  req.body.appId = T_BodyApp.id;
  req.body.applicationId = req.headers.applicationid2;
  req.body.user = req.user.id;
  req.body.userName = req.user.name;
  req.body.userEmail = req.user.email;
  req.body.company = req.user.company;
  req.body.branch = req.user.branch;
  req.body.area = req.user.area;

  console.log("User", req.user);

  var mymap = getCreateMap(
    req.headers.applicationid,
    req.headers.applicationid2
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
  source = outData["data"];

  //myInv = setHeader(source, myInv, mymap);

  for (const key in mymap.HeaderMap) {
    for (let index = 0; index < source.length; index++) {
      console.log("Rashmi", source[index]);
      const el2 = source[index];
      myInv[key] = el2[key];
    }
  }
  console.log("MyInv", myInv);

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
    req.headers.applicationid2,
    req.headers.businessrole
  );

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

  res.status(200).json({
    outData,
  });
});
