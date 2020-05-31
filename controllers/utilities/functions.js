const asyncHandler = require("../../middleware/async");
const Possval = require("../../models/appSetup/Possval");
const ErrorResponse = require("../../utils/errorResponse");

module.exports = {
  checkCompany: function (a, b) {
    if (!a) {
      return `The user with ID ${b} is not setup for any company`;
    }
  },

  headerApp: function (a) {
    if (!a) {
      return new ErrorResponse(`Please provide App ID(Header)`, 400);
    }
  },
  headerRole: function (a) {
    if (!a) {
      return new ErrorResponse(`Please provide Role(Header)`, 400);
    }
  },
  sum: function (a, b) {
    return a + b;
  },
  isEven: function (a) {
    return a % 2 == 0;
  },
};
