const asyncHandler = require("../../middleware/async");
const fs = require("fs");

const { checkFile } = require("../../modules/config");
const {
  aggregateCount,
  aggregateSum,
  tileCount,
} = require("../../modules/config2");
exports.test = asyncHandler(async (req, res, next) => {
  // Get App data
  let App = "../../models/appSetup/App";
  const Model_App = require(App);
  apps = await Model_App.find({});
  // Get App Role data
  let Approle = "../../models/appSetup/Approle";
  const Model_Approle = require(Approle);
  approle = await Model_Approle.find({});

  console.log("App Setup Checks..", approle);
  var set_app = new Set([]);
  var set_role = new Set([]);
  var set_approle = new Set([]);
  approle.forEach((e2) => {
    e2["Apps"].forEach((e3) => {
      set_app.add(e3["applicationID"]);
      m1 = e3["applicationID"] + "_" + e2["role"] + "_config.json";
      set_approle.add(m1);
      console.log("----------------------");
      console.log(
        e2["role"],
        e3["applicationID"],
        e3["descriptions"][0]["appDescription"]
      );
    });
    set_role.add(e2["role"]);
  });

  set_approle.forEach((con1) => {
    res001 = checkFile(con1);
    if (res001 == "Success") {
      var result = require(path);
      console.error("File found : ", con1);
    } else {
      console.error("File Not found : ", con1);
    }
  });

  // console.log(set_app, set_role, set_approle);

  // // Loop App

  // let path = "../../models/smartApp/" + "HC0001";
  // let path2 = "../../models/smartApp/" + "EMP00004";
  // let path3 = "../../models/access/" + "User";

  // const Model = require(path);
  // const Model2 = require(path2);
  // const Model3 = require(path3);

  // // Get Count from mongoDB
  // c1 = await Model.countDocuments({
  //   Status: "New",
  // });
  // console.log("Count...DB", c1);

  // // Get Count from mongoDB
  // c2 = await Model.distinct("Speciality");
  // console.log("Distinct values for Speciality...DB", c2);

  // // Aggregate(SUM) from mongoDB
  // filter = { Status: "Submitted" };

  // aggSum = await aggregateSum(req, "VendorName", "NetValue", "Ascending");
  // console.log("aggSum:", aggSum);

  // aggCount = await aggregateCount(req, "VendorName", "Descending");
  // console.log("aggCount:", aggCount);

  // //Left Outer Join (Simple)
  // // Aggregate(SUM) from mongoDB
  // c4 = await Model3.aggregate([
  //   //   { $match: filter },
  //   {
  //     $lookup: {
  //       from: "empnew01",
  //       localField: "email",
  //       foreignField: "Email",
  //       as: "EMP_Details",
  //     },
  //   },
  //   //  { $group: { _id: ID, total: { $sum: Value } } },
  //   //  { $sort: Sort },
  // ]);

  // //Left Outer Join (with Conditions)
  // // Aggregate(SUM) from mongoDB
  // c5 = await Model3.aggregate([
  //   //   { $match: filter },
  //   {
  //     $lookup: {
  //       from: "empnew01",
  //       let: { em: "$email", comp: "$company" },
  //       pipeline: [
  //         {
  //           $match: {
  //             $expr: {
  //               $and: [
  //                 { $eq: ["$Email", "$$em"] },
  //                 { $eq: ["$company", "$$comp"] },
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           $project: {
  //             Benefits: 1,
  //             FirstName: 1,
  //             LastName: 1,
  //             EmployeeID: 1,
  //           },
  //         },
  //       ],

  //       as: "newMatch",
  //     },
  //   },
  //   //  { $group: { _id: ID, total: { $sum: Value } } },
  //   //  { $sort: Sort },
  // ]);

  // console.log("Lookup...", c4);
  // console.log("Lookup...", c5);
  // console.log("Smart Programming Examples...");
  // // Get Count
  // let array = [1, 2, 3, 5, 2, 8, 9, 2];
  // clt = array.filter((x) => x === 2).length; // -> 3
  // console.log("Count .... Array", clt);
  // myData = [];

  // tCount = await tileCount(req);
  // res.status(200).json({
  //   success: true,
  //   data: myData,
  //   agg_count: aggCount,
  //   agg_sum: aggSum,
  //   lookup: c4,
  //   lookup2: c5,
  //   tCount: tCount,
  // });
  res.status(200).json({
    success: true,
    apps: set_app,
    role: set_role,
    appRole: set_approle,
  });
});
