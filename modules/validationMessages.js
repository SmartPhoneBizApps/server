const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
  valAlreadyReg: function (email) {
    return `User with id of ${email} is already registered`;
  },
  valAppNotNull: function (app) {
    if (!app) {
      return `Field ${app} can't be used with this App`;
    }
    return "Validation Pass";
  },
};
