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
exports.oneDriveUpload = asyncHandler(async (req, res, next) => {
  var fs = require("fs");
  var mime = require("mime");
  var request = require("request");

  var file = "./sample.zip"; // Filename you want to upload on your local PC
  var onedrive_folder = "SampleFolder"; // Folder name on OneDrive
  var onedrive_filename = "sample.zip"; // Filename on OneDrive

  request.post(
    {
      url: "https://login.microsoftonline.com/common/oauth2/v2.0/token",
      form: {
        redirect_uri: "http://localhost/dashboard",
        client_id: onedrive_client_id,
        client_secret: onedrive_client_secret,
        refresh_token: onedrive_refresh_token,
        grant_type: "refresh_token",
      },
    },
    function (error, response, body) {
      fs.readFile(file, function read(e, f) {
        request.put(
          {
            url:
              "https://graph.microsoft.com/v1.0/drive/root:/" +
              onedrive_folder +
              "/" +
              onedrive_filename +
              ":/content",
            headers: {
              Authorization: "Bearer " + JSON.parse(body).access_token,
              "Content-Type": mime.getType(file), // When you use old version, please modify this to "mime.lookup(file)",
            },
            body: f,
          },
          function (er, re, bo) {
            console.log(bo);
          }
        );
      });
    }
  );
});
