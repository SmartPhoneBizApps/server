const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
const ErrorResponse = require("../utils/errorResponse");

module.exports = {
  valAlreadyReg: function (email) {
    return `User with id of ${email} is already registered`;
  },
};
