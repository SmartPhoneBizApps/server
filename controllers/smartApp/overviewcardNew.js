const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");
const { getCard } = require("../../modules/config");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.overviewcardNew = async (req, res, next) => {
  // Read Color Configuration
  console.log(req.query.mycard);

  var mycard = {};
  mycard["title"] = "SmartApp App";
  mycard["subTitle"] = "List of Items";
  mycard["headerIcon"] = "sap-icon://form";

  result = getCard(mycard, req.query.mycard);

  res.status(200).json({ success: true, data: result });
};
