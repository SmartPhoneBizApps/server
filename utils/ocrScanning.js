const path = require("path");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const { getNewConfig, createMultipleDocument } = require("../modules/config");
let csvToJson = require("convert-csv-to-json");
const App = require("../models/appSetup/App");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.ocrScanning = asyncHandler(async (req, res, next) => {
  var request = require("request");
  console.log("OCR Scanning...");
  body = req.body;
  request(
    {
      method: "POST",
      url: "https://backgroundprocess.herokuapp.com/?",
      json: true,
      headers: {
        Accept: "application/fhir+json",
      },
      body: body,
    },

    function (error0, response0, body0) {
      console.log(body0);

      res.status(201).json({
        success: true,
        data: body0,
      });
    }
  );

  res.status(200).json({
    success: true,
    message:
      "OCR of the document is scheduled in background, check after few mins",
  });
});
