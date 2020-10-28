const asyncHandler = require("../middleware/async");
const sendEmail = require("./sendEmail");

exports.emailAttachment = asyncHandler(async (req, res, next) => {
  let header = {};
  var pdf = req.body.file;
  var message = "Add attachment in email ...";
  try {
    await sendEmail({
      email: req.body.email,
      subject: "Email with Attachment",
      message,
      attachments: [
        {
          filename: req.body.fileName,
          content: new Buffer(pdf, "base64"),
          // contentType: 'application/pdf',
        },
      ],
    });
    res.status(200).json({
      success: true,
      resetURL: "Email Sent",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      resetURL: "Error email can't be sent",
    });
  }
});
