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
  // Get Parent App data
  source = outData["data"];
  // Set InputValues
  mymap.Inputs.forEach((el1) => {
    if (!req.body[el1]) {
      return next(new ErrorResponse(`Input Field ${el1} missing (Body)`, 400));
    } else {
      myInv[el1] = req.body[el1];

      for (let ix1 = 0; ix1 < source.length; ix1++) {
        for (let ix2 = 0; ix2 < source[ix1]["ItemData"].length; ix2++) {
          source[ix1]["ItemData"][ix2][el1] = req.body[el1];
          console.log(el1, ">>", source[ix1]["ItemData"][ix2][el1]);
        }
      }
    }
  });
  // Update Source data (Example - PO)
  for (const key in mymap.SourceUpdate.ItemMap) {
    for (let ix1 = 0; ix1 < source.length; ix1++) {
      for (let ix2 = 0; ix2 < source[ix1]["ItemData"].length; ix2++) {
        source[ix1]["ItemData"][ix2][key] =
          source[ix1]["ItemData"][ix2][mymap.SourceUpdate.ItemMap[key]];
        console.log(
          mymap.SourceUpdate.ItemMap[key],
          "..",
          source[ix1]["ItemData"][ix2][mymap.SourceUpdate.ItemMap[key]],
          "..",
          key,
          "..",
          source[ix1]["ItemData"][ix2][key]
        );
      }
    }
  }

  // Collect Source data (Example - PO)
  for (let index = 0; index < source.length; index++) {
    const element = source[index];
    myPO = element;
  }
  // console.log("myPO", myPO);
  // Perform Source Calc
  console.log(mymap.SourceUpdate.Checks);
  let upd_arr = [];
  for (let i1 = 0; i1 < mymap.SourceUpdate.Checks.length; i1++) {
    const e1 = mymap.SourceUpdate.Checks[i1];

    for (const k2 in e1) {
      const e2 = e1[k2];
      if (k2 == "Defaults") {
        console.log("Defaults");
        for (const k4 in e2) {
          const e4 = e2[k4];
          console.log("e4", e4, ">>", k4);
          myPO[k4] = e4;
          console.log("myPO[k4]", myPO[k4]);
        }
      }
      if (k2 == "Results") {
        console.log("Results");
        for (let i3 = 0; i3 < e2.length; i3++) {
          upd_arr.push(e2[i3]);
        }
        console.log(upd_arr);
      }
      if (k2 == "Conditions") {
        console.log("Conditions");
        for (let i3 = 0; i3 < e2.length; i3++) {
          const e3 = e2[i3];
          for (const k4 in e3) {
            const e4 = e3[k4];
            var n = k4.includes("ItemData");
            if (n == true) {
              x1 = k4.split("_")[1];
              console.log(x1);
              query = {};
              query["ID"] = myPO["ID"];
              query[x1] = { $ne: e4 };
              console.log("q1", query);
              let query2 = JSON.stringify(query);
              console.log("q2", query2);
              dbItems1 = await SUPP00018_Itm.find(query);
              //{ID:"450000002", ItemInvoiceStatus:{$ne:"Complete"}}
              //.countDocuments();
              dbItems = dbItems1.length;
              console.log(dbItems1);

              if (dbItems == myPO["ItemData"].length) {
                console.log(dbItems, ">=", myPO["ItemData"].length, x1);
                console.log(upd_arr);
                for (let index = 0; index < upd_arr.length; index++) {
                  console.log(upd_arr[index]);
                  for (const key in upd_arr[index]) {
                    myPO[key] = upd_arr[index][key];
                    console.log("myPO[key]", myPO[key], key);
                  }
                }
              } else {
                console.log(dbItems, ">", myPO["ItemData"].length);
              }
            }
          }
        }
      }
    }
  }

  // let myPO = source;

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
