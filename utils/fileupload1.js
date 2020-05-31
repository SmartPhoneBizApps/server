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
  const header = req.files.header;
  const item = req.files.item;
  if (!req.files) {
    return next(new ErrorResponse(`Please upload a file`, 400));
  }
  if (!header.mimetype.startsWith("text/csv")) {
    return next(new ErrorResponse(`Please upload an csv file(header)`, 400));
  }

  if (header.size > process.env.MAX_FILE_UPLOAD) {
    return next(
      new ErrorResponse(
        `Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,
        400
      )
    );
  }

  header.name = `header_${req.user.id}${path.parse(header.name).ext}`;
  const headercsvFilePath = "./public/uploadFiles/" + header.name;
  header.mv(`${process.env.DATA_UPLOAD_PATH}/${header.name}`, async (err) => {
    if (err) {
      console.error(err);
      return next(new ErrorResponse(`Problem with file upload`, 500));
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  });
});
