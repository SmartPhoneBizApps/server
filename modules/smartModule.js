const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
  getCreateMap: function (sapp, tapp) {
    // Read Create Map Config
    // This will be used only when you create record copying data from sapp to tapp
    let fn =
      "../NewConfig/" + sapp + "_" + tapp + "_" + trans + "_createmap.json";
    var result = require(fn);
    return result;
  },
  getNewConfig: function (a, b) {
    // Read Create Map Config
    // These are converted old XML files from smartapp
    let fn = "../NewConfig/" + a + "_" + b + "_config.json";
    var result = require(fn);
    return result;
  },
};
