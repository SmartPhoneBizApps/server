const asyncHandler = require("../middleware/async");

//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.dummyUpload = asyncHandler(async (req, res, next) => {
  res.status(200).json({
    fileName: "test.txt",
  });
});
