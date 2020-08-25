const path = require("path");
const ErrorResponse = require("./errorResponse");
const asyncHandler = require("../middleware/async");
const { getNewConfig, createMultipleDocument } = require("../modules/config");
let csvToJson = require("convert-csv-to-json");
const App = require("../models/appSetup/App");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.messengerNotify = asyncHandler(async (req, res, next) => {
  var request = require("request");

  request.post(
    "https://fbnotificationbot.herokuapp.com/?userFBID=1805665356118639&role=Employee&message=Your%20record%20created%20successfully...&messageType=Text",
    function (error, response, body) {
      console.log("Notification sent", error);
      res.status(200).json({
        success: true,
        data: "Document Created",
      });
    }
  );
});
