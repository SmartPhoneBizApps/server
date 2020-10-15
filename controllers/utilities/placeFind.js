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
exports.placeFind = asyncHandler(async (req, res, next) => {
  var PLACE = req.params.id;
  // var PLACE = "GSK House";
  var API_KEY = "AIzaSyC9b79SQJZc2m8aQpcX9QD87crX87ANDv8";
  var FIELDS =
    "name,id,rating,business_status,geometry,icon,opening_hours,photos,types,formatted_address,price_level";

  reqGoogle =
    "https://maps.googleapis.com/maps/api/place/findplacefromtext/json" +
    "?input=" +
    PLACE +
    "&inputtype=textquery" +
    "&fields=" +
    FIELDS +
    "&key=" +
    API_KEY;

  https: request(
    reqGoogle,
    {
      json: true,
    },
    (err, res1, body) => {
      if (err) {
        res.status(400).json({
          success: false,
          data: [],
        });
      }

      address = {};
      out1 = {};
      outData = [];

      for (let x = 0; x < body["candidates"].length; x++) {
        const a1 = body["candidates"][x];
        if (a1.hasOwnProperty("name")) {
          out1["name"] = a1.name;
        }
        if (a1.hasOwnProperty("formatted_address")) {
          out1["formatted_address"] = a1.formatted_address;
        }
        if (a1.hasOwnProperty("rating")) {
          out1["rating"] = a1.formatted_address;
        }
        outData.push(out1);
        out1 = {};
      }
      res.status(200).json({
        success: true,
        data: body,
        out: outData,
      });
    }
  );
});
