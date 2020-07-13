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
exports.uploadFileOnly = asyncHandler(async (req, res, next) => {
  // Note the logic currently supports only one file at a time..
  console.log("Inside Upload...");
  const file = req.files.file;
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!req.files.file) {
    return next(new ErrorResponse(`No file with parameter file`, 400));
  }
  const header = req.files.file;
  console.log(header.mimetype);
  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }
  if (!req.headers.mode) {
    return next(new ErrorResponse(`Please provide header data mode`, 400));
  }

  let filePath;
  switch (req.params.mode) {
    case "questioner":
      filePath = "./questioner/LEARNING_" + req.params.ID + ".json";
      file.name = "LEARNING_" + req.params.ID + ".json";
      break;
    case "openSAP":
      filePath = "./NewConfig/" + "openSAP_courses.json";
      file.name = "openSAP_courses.json";
      break;
    default:
      break;
  }

  file.mv(filePath, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }
    res.status(200).json({
      success: true,
      fileName: filePath,
      fileType: file.mimetype,
      fileSize: file.size,
      uploadedBy: req.user.name,
    });
  });
});
