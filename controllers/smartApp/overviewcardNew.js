const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.overviewcardNew = async (req, res, next) => {
  // Read Color Configuration
  let cardConfigFile = "../../cards/cardConfig/card_template.json";
  var cardConfig = require(cardConfigFile);
  var cardStru = cardConfig["Structure"];
  var cardType = "timeline1";

  const { getCard } = require("../../modules/config");

  var mycard = {};
  mycard["title"] = "SmartApp App";
  mycard["subTitle"] = "List of Items";

  result = getCard(mycard, "timeline1");

  res.status(200).json({ success: true, data: result });
};
