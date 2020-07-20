const { sendHtmlEmail } = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Approle = require("../../models/appSetup/Approle");
const {
  getPVConfig,
  getPVQuery,
  getButtonData,
  getInitialValues,
  getDateValues,
  findOneApp,
} = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.tilecountGet = asyncHandler(async (req, res, next) => {
  let approle = await Approle.findOne({ role: req.headers.role });
  if (!approle) {
    return next(
      new ErrorResponse(
        `No record for Role and Apps found for  ${req.params.id}`,
        404
      )
    );
  }

  console.log(approle["Apps"]);
  for (let x = 0; x < approle["Apps"].length; x++) {
    console.log(approle["Apps"][x]["applicationID"]);
    // Read New Config File
    let fn =
      "../../NewConfig/" +
      approle["Apps"][x]["applicationID"] +
      "_" +
      req.headers.role +
      "_config.json";
    var config1 = require(fn);

    query = getTotalCount(approle["Apps"][x]["applicationID"], req, config1);
    let count = await query;

    console.log("App", approle["Apps"][x]["applicationID"], count);
  }

  console.log("Atul");
  //   const application = await findOneApp(req.params.id);
  //   data = [];

  //   approles
  //   role
  // :
  // "AccessAdmin"

  res.status(200).json({
    success: true,
    data: approle,
  });
});
