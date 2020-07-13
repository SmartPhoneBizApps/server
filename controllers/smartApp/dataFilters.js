const { findOneAppDatabyid } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.dataFilters = asyncHandler(async (req, res, next) => {
  var data = {
    Status: [
      {
        val: "Submitted",
        key: "Submitted",
        count: 2,
      },
      {
        val: "new",
        key: "new",
        count: 1,
      },
    ],

    // FirstName: [
    //   {
    //     val: "Amit",
    //     key: "Amit",
    //     count: 2,
    //   },
    //   {
    //     val: "Atul",
    //     key: "Atul",
    //     count: 10,
    //   },
    // ],
  };

  res.status(200).json({
    success: true,
    data: data,
  });
});
