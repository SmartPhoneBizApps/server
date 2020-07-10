const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
//const postcode = require("../../models/utilities/postcode.js");
const { getNewConfig, getpostcodeData } = require("../../modules/config");

const request = require("request");
const https = require("https");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)

// var aa = new calfunction();
// console.log(aa.Handler[ADD1()]);
// return false;

exports.getaddress = asyncHandler(async (req, res, next) => {
  var postcode = req.params.id;
  var houseNo = "";

  var API_KEY = "g0Obs9X3fE-Fqvt59gA3vA26300";

  if (houseNo != "") {
    postcode += "/" + houseNo;
  }

  //api.getaddress.io/find/SL15DGK?api-key=g0Obs9X3fE-Fqvt59gA3vA26300

  https: request(
    "https://api.getaddress.io/find/" + postcode + "?api-key=" + API_KEY,
    {
      json: true,
    },
    (err, res1, body) => {
      if (err) {
        res.status(201).json({
          success: true,
          data: [],
        });
      }
      if (res1.statusCode == 200) {
        res.status(201).json({
          success: true,
          data: body["addresses"],
        });
      } else {
        res.status(201).json({
          success: true,
          data: body["Message"],
        });
      }
    }
  );
});
