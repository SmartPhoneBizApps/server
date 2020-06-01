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
exports.uploadFile = asyncHandler(async (req, res, next) => {
  console.log("Inside Upload ");
  const file = req.files.file;
  console.log("File1 ", req.files.file);
  console.log("File2 ", req.file);

  if (!req.files.file) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  /*   if (!file.mimetype.startsWith("text/csv")) {
    return next(new ErrorResponse(`Please upload an csv file(file)`, 400));
  } */

  if (file.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  file.name = `file_${req.user.id}${path.parse(file.name).ext}`;
  console.log("Inside Upload ", file.name);
  const filecsvFilePath = "./public/uploadFiles/" + file.name;
  const outFileName = "/public/uploadFiles/" + file.name;
  file.mv(`${process.env.DATA_UPLOAD_PATH}/${file.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    res.status(200).json({
      success: true,
      fileName: outFileName,
      fileType: file.mimetype,
    });
  });
});
