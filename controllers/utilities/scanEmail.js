const asyncHandler = require("../../middleware/async");
const request = require("request");

// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)
exports.scanEmail = asyncHandler(async (req, res, next) => {
  user = process.env.SMTP_EMAIL;
  password = process.env.SMTP_PASSWORD;
  host = process.env.SMTP_HOST;
  port = process.env.SMTP_PORT;

  console.log("EmailClient-MailTrap", user, password, host, port);

  res.status(201).json({
    success: true,
  });
});
