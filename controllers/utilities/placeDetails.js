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

exports.placeDetails = asyncHandler(async (req, res, next) => {
  // var postcode = "req.params.id";
  var PLACEID = "ChIJN1t_tDeuEmsRUsoyG83frY4";
  var API_KEY = "AIzaSyC9b79SQJZc2m8aQpcX9QD87crX87ANDv8";
  var FIELDS =
    "name,id,rating,business_status,geometry,icon,address_components,opening_hours,photos,types,formatted_phone_number,formatted_address,adr_address,website,vicinity,international_phone_number,price_level,reviews,url,utc_offset";
  reqGoogle =
    "https://maps.googleapis.com/maps/api/place/details/json" +
    "?place_id=" +
    PLACEID +
    "&fields=" +
    FIELDS +
    "&key=" +
    API_KEY;
  console.log(reqGoogle);
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
      outData = {};

      if (body.result.hasOwnProperty("international_phone_number")) {
        outData["international_phone_number"] =
          body.result.international_phone_number;
      }
      if (body.result.hasOwnProperty("name")) {
        outData["name"] = body.result.name;
      }
      if (body.result.hasOwnProperty("business_status")) {
        outData["business_status"] = body.result.business_status;
      }
      if (body.result.hasOwnProperty("geometry")) {
        outData["geometry"] = body.result.geometry;
      }
      if (body.result.hasOwnProperty("formatted_address")) {
        address["formatted_address"] = body.result.formatted_address;
      }
      for (let i = 0; i < body.result.address_components.length; i++) {
        const e2 = body.result.address_components[i];
        console.log(e2);

        for (let a = 0; a < e2.types.length; a++) {
          console.log(e2.types[a]);
          switch (e2.types[a]) {
            case "street_number":
              address["house_no"] = e2["short_name"];

              break;
            case "route":
              address["street"] = e2["short_name"];
              break;
            case "locality":
              address["city"] = e2["short_name"];
              break;
            case "administrative_area_level_2":
              address["district"] = e2["short_name"];
              break;
            case "administrative_area_level_1":
              address["state"] = e2["short_name"];
              break;
            case "country":
              address["country"] = e2["short_name"];
              break;
            case "postal_code":
              address["postal_code"] = e2["short_name"];
              break;
            default:
              break;
          }
        }
      }
      outData["address"] = address;
      if (body.result.hasOwnProperty("photos")) {
        outData["photos"] = body.result.photos;
      }
      if (body.result.hasOwnProperty("rating")) {
        outData["rating"] = body.result.rating;
      }
      if (body.result.hasOwnProperty("reviews")) {
        outData["reviews"] = body.result.reviews;
      }
      if (body.result.hasOwnProperty("types")) {
        outData["types"] = body.result.types;
      }
      if (body.result.hasOwnProperty("url")) {
        outData["url"] = body.result.url;
      }
      if (body.result.hasOwnProperty("website")) {
        outData["website"] = body.result.website;
      }

      console.log(res1.statusCode);
      res.status(200).json({
        success: true,
        data: body,
        out: outData,
      });
    }
  );
});
