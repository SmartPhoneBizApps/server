const { findOneAppDatabyid } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.getItems = asyncHandler(async (req, res, next) => {
  console.log(req.params.appID);
  itm = [];
  result = await findOneAppDatabyid(req.params.id, req.params.appID);
  console.log(result);
  itm = result["ItemData"];

  res.status(200).json({
    success: true,
    data: itm,
  });
});
