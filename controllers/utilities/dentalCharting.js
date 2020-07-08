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

exports.dentalCharting = asyncHandler(async (req, res, next) => {
  let out = {};
  switch (req.params.patientID) {
    case "1000":
      out["patientID"] = "1000";
      out["patientName"] = "Atul Gupta";
      out["topleft"] = "8764321";
      out["topright"] = "1234E678";
      out["bottomleft"] = "8765421";
      out["bottomright"] = "12345678";
      break;
    case "1001":
      out["patientID"] = "1000";
      out["patientName"] = "Rashmi Gupta";
      out["topleft"] = "87654321";
      out["topright"] = "1345678";
      out["bottomleft"] = "8654321";
      out["bottomright"] = "1234568";
      break;
    case "1002":
      out["patientID"] = "1000";
      out["patientName"] = "Ankit Jain";
      out["topleft"] = "8765431";
      out["topright"] = "12345678";
      out["bottomleft"] = "8754321";
      out["bottomright"] = "12C45678";
      break;
    case "1003":
      out["patientID"] = "1000";
      out["patientName"] = "Rakesh Sharma";
      out["topleft"] = "87653B1";
      out["topright"] = "12345678";
      out["bottomleft"] = "8764321";
      out["bottomright"] = "12345678";
      break;
    case "1004":
      out["patientID"] = "1000";
      out["patientName"] = "Akash Sharma";
      out["topleft"] = "8765432A";
      out["topright"] = "1234578";
      out["bottomleft"] = "876543B1";
      out["bottomright"] = "12345678";
      break;
    default:
      break;
  }

  res.status(201).json({
    success: true,
    data: out,
  });
});
