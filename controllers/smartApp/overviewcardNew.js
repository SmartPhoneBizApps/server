const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");
const { getCard } = require("../../modules/config");
const { readData, getTotalCount, nConfig } = require("../../modules/config2");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.overviewcardNew = async (req, res, next) => {
  let result = {};
  // Read Color Configuration
  console.log(req.headers.mycard);

  var mycard = {};
  mycard["title"] = "SmartApp App";
  mycard["subTitle"] = "List of Items";
  mycard["headerIcon"] = "sap-icon://form";
  mycard["businessrole"] = req.headers.businessrole;
  mycard["applicationid"] = "EMP00001";
  mycard["HeaderIcon"] = "sap-icon://bus-public-transport";
  mycard["statusText"] = "Status Text 001";

  let fn1 =
    "../../NewConfig/" +
    "EMP00001" +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var config1 = require(fn1);
  console.log(fn1);

  //mycard["Type"] = "sap-icon://form";
  let query = readData("EMP00001", req, config1);
  let results = await query;
  //console.log(results);
  if (config1["cardData"]) {
    for (let k = 0; k < config1["cardData"].length; k++) {
      if (config1["cardData"][k]["table1"]) {
        mycard["TableFields"] = config1["cardData"][k]["TableFields"];
        result = getCard(mycard, req.headers.mycard, results);
      }
    }
  }

  res.status(200).json({ success: true, data: result });
};
