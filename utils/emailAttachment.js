const asyncHandler = require("../middleware/async");
const sendEmail = require("./sendEmail");
//let csvToJson = require("convert-csv-to-json");
// @desc      Get all bootcamps
// @route     GET /api/v1/bootcamps
// @access    Public
exports.emailAttachment = asyncHandler(async (req, res, next) => {
  // Note the logic currently supports only one file at a time..
  console.log("Email with Attachment...");
  let header = {};
  let file = "";
  if (req.body.file != undefined) {
    b64file = req.body.file;
    b64file = trim(
      str_replace("data:application/pdf;base64,", "", req.files.file)
    );
    // b64file = str_replace(" ", "+", b64file);
    file = b64file.toString("utf-8");
  }
  message = file;
  try {
    await sendEmail({
      email: "atul@gmail.com",
      subject: "Email with Attachment",
      message,
    });
    res.status(200).json({
      success: true,
      resetURL: "Email Sent",
    });
  } catch (err) {
    console.log(err);

    res.status(400).json({
      success: false,
      resetURL: "Error email can't be sent",
    });
  }
});
