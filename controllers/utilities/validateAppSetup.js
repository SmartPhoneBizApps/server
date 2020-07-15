var randomstring = require("randomstring");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.validateAppSetup = (req, res, next) => {
  let messages = [];
  let mStru = {};

  // Read New Config File
  var config = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );

  // 001 - Validation  - Check if Config File Exists
  if (!config) {
    mStru["type"] = "error";
    mStru["number"] = "001";
    mStru[
      "message"
    ] = `Config file missing for App: ${req.headers.applicationid} & Role: ${req.headers.businessrole}`;
    messages.push({ ...mStru });
    mStru = {};
  }
  // 002 - Validation  - Check if Config File Exists

  res.status(200).json({
    success: true,
    data: messages,
  });
};
