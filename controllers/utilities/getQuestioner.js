const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const { getNewConfig } = require("../../modules/config");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.getQuestioner = asyncHandler(async (req, res, next) => {
  console.log(req.params.area);
  console.log(req.params.ID);

  let fn =
    "../../questioner/" + req.params.area + "_" + req.params.ID + ".json";
  var result = require(fn);

  res.status(201).json({
    success: true,
    data: result,
  });
});
