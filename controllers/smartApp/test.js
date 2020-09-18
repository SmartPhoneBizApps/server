const asyncHandler = require("../../middleware/async");
const { aggregateSum, aggregateCount } = require("../../modules/config");
exports.test = asyncHandler(async (req, res, next) => {
  let path = "../../models/smartApp/" + "HC0001";
  let path2 = "../../models/smartApp/" + "EMP00004";

  const Model = require(path);
  const Model2 = require(path2);

  // Get Count from mongoDB
  c1 = await Model.count({
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

  console.log("Smart Programming Examples...");
  // Get Count
  let array = [1, 2, 3, 5, 2, 8, 9, 2];
  clt = array.filter((x) => x === 2).length; // -> 3
  console.log("Count .... Array", clt);
  myData = [];
  res.status(200).json({
    success: true,
    data: myData,
  });
});
