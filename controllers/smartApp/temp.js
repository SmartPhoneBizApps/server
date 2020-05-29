const asyncHandler = require("../../middleware/async");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00018_Itm = require("../../models/smartApp/SUPP00018_Itm");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const SUPP00007 = require("../../models/smartApp/SUPP00007");
const SUPP00028_Itm = require("../../models/smartApp/SUPP00028_Itm");
const App = require("../../models/appSetup/App");
const calfunction = require("../../models/utilities/calfunction.js");
const {
  getCreateMap,
  getNewConfig,
  createRefSetBody,
} = require("../../modules/config");
const ErrorResponse = require("../../utils/errorResponse");

// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.temp = asyncHandler(async (req, res, next) => {
  pagination = {};
  results = {};
  config = {};

  res.status(200).json({
    success: true,
    count: 1,
    pagination,
    data: results,
    // cardImage: app["photo"],
    config: config,
  });
});
