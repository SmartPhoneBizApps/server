const asyncHandler = require("../../middleware/async");
const {
  aggregateCount,
  aggregateSum,
  tileCount,
} = require("../../modules/config2");
exports.test = asyncHandler(async (req, res, next) => {
  let path = "../../models/smartApp/" + "HC0001";
  let path2 = "../../models/smartApp/" + "EMP00004";
  let path3 = "../../models/access/" + "User";

  const Model = require(path);
  const Model2 = require(path2);
  const Model3 = require(path3);

  // Get Count from mongoDB
  c1 = await Model.countDocuments({
    Status: "New",
  });
  console.log("Count...DB", c1);

  // Get Count from mongoDB
  c2 = await Model.distinct("Speciality");
  console.log("Distinct values for Speciality...DB", c2);

  // Aggregate(SUM) from mongoDB
  filter = { Status: "Submitted" };

  aggSum = await aggregateSum(req, "VendorName", "NetValue", "Ascending");
  console.log("aggSum:", aggSum);

  aggCount = await aggregateCount(req, "VendorName", "Descending");
  console.log("aggCount:", aggCount);

  //Left Outer Join (Simple)
  // Aggregate(SUM) from mongoDB
  c4 = await Model3.aggregate([
    //   { $match: filter },
    {
      $lookup: {
        from: "empnew01",
        localField: "email",
        foreignField: "Email",
        as: "EMP_Details",
      },
    },
    //  { $group: { _id: ID, total: { $sum: Value } } },
    //  { $sort: Sort },
  ]);

  //Left Outer Join (with Conditions)
  // Aggregate(SUM) from mongoDB
  c5 = await Model3.aggregate([
    //   { $match: filter },
    {
      $lookup: {
        from: "empnew01",
        let: { em: "$email", comp: "$company" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$Email", "$$em"] },
                  { $eq: ["$company", "$$comp"] },
                ],
              },
            },
          },
          {
            $project: {
              Benefits: 1,
              FirstName: 1,
              LastName: 1,
              EmployeeID: 1,
            },
          },
        ],

        as: "newMatch",
      },
    },
    //  { $group: { _id: ID, total: { $sum: Value } } },
    //  { $sort: Sort },
  ]);

  console.log("Lookup...", c4);
  console.log("Lookup...", c5);
  console.log("Smart Programming Examples...");
  // Get Count
  let array = [1, 2, 3, 5, 2, 8, 9, 2];
  clt = array.filter((x) => x === 2).length; // -> 3
  console.log("Count .... Array", clt);
  myData = [];

  tCount = await tileCount(req);
  res.status(200).json({
    success: true,
    data: myData,
    agg_count: aggCount,
    agg_sum: aggSum,
    lookup: c4,
    lookup2: c5,
    tCount: tCount,
  });
});
