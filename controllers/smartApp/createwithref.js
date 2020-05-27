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
  // Get the App result from Advance List..
  let outData = res.advancedDataList;
  // Basic validations
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

  // Get the mapping config
  var mymap = getCreateMap(
    req.headers.applicationid,
    req.headers.applicationid2,
    req.headers.transaction
  );
  myInv = {};
  myInv = req.body;

  // Get Parent App data
  source = outData["data"];

  // Update Source data (Example - PO to Invoice values)
  for (const key in mymap.SourceUpdate.ItemMap) {
    for (let ix1 = 0; ix1 < source.length; ix1++) {
      for (let ix2 = 0; ix2 < source[ix1]["ItemData"].length; ix2++) {
        source[ix1]["ItemData"][ix2][key] =
          source[ix1]["ItemData"][ix2][mymap.SourceUpdate.ItemMap[key]];
      }
    }
  }
  // Set InputValues to Source Item Data...
  mymap.Inputs.forEach((el1) => {
    if (!req.body[el1]) {
      //     return next(new ErrorResponse(`Input Field ${el1} missing (Body)`, 400));
    } else {
      myInv[el1] = req.body[el1];
      for (let ix1 = 0; ix1 < source.length; ix1++) {
        for (let ix2 = 0; ix2 < source[ix1]["ItemData"].length; ix2++) {
          source[ix1]["ItemData"][ix2][el1] = req.body[el1];
        }
      }
    }
  });
  // Collect Source data (Example - PO)
  for (let index = 0; index < source.length; index++) {
    const element = source[index];
    myPO = element;
    // Note this is updated in next section, don't change the order
  }

  // Perform Source Calc
  let upd_arr = [];
  for (let i1 = 0; i1 < mymap.SourceUpdate.Checks.length; i1++) {
    const e1 = mymap.SourceUpdate.Checks[i1];

    // Below is the logic to set default value,
    for (const k2 in e1) {
      const e2 = e1[k2];
      if (k2 == "Defaults") {
        for (let i3 = 0; i3 < e2.length; i3++) {
          const e3 = e2[i3];
          for (const k4 in e3) {
            myPO[k4] = e3[k4];
          }
        }
      }
      // collect the results which need to be set when conditions are checked..(Below)
      if (k2 == "Results") {
        for (let i3 = 0; i3 < e2.length; i3++) {
          upd_arr.push(e2[i3]);
        }
      }
      // Check condition and update the header values..
      if (k2 == "Conditions") {
        for (let i3 = 0; i3 < e2.length; i3++) {
          const e3 = e2[i3];
          for (const k4 in e3) {
            const e4 = e3[k4];
            var n = k4.includes("ItemData");
            if (n == true) {
              x1 = k4.split("_")[1];
              query = {};
              query["ID"] = myPO["ID"];
              query[x1] = { $ne: e4 };
              dbItems = await SUPP00018_Itm.find(query).countDocuments();
              if (dbItems == myPO["ItemData"].length) {
                for (let index = 0; index < upd_arr.length; index++) {
                  for (const key in upd_arr[index]) {
                    myPO[key] = upd_arr[index][key];
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  // Here we are mapping Target App
  for (const key in mymap.HeaderMap) {
    for (let index = 0; index < source.length; index++) {
      const el2 = source[index];
      myInv[key] = el2[key];
    }
  }
  if (mymap["Conversion"]) {
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
  if (req.headers.applicationid != req.headers.applicationid2) {
    result = await SUPP00028.create(myInv);
    result = await SUPP00028_Itm.create(myInv.ItemData);
  }

  result = await SUPP00018.findByIdAndUpdate(myPO.id, myPO, {
    new: true,
    runValidators: true,
  });
  for (let index = 0; index < myPO.ItemData.length; index++) {
    result = await SUPP00018_Itm.findOneAndUpdate(
      { ID: myPO.ID, ItemNumber: myPO.ItemData[index]["ItemNumber"] },
      myPO.ItemData[index],
      {
        new: true,
        runValidators: true,
      }
    );
  }
  mydata = {};

  res.status(200).json({
    outData,
  });
});
