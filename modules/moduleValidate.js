const asyncHandler = require("../middleware/async");
const Possval = require("../models/appSetup/Possval");
//const ErrorResponse = require("../utils/errorResponse");
//var button = require("../bot/Supplier_button.json");
const Agent = require("../models/access/Agent");
const App = require("../models/appSetup/App");
const Role = require("../models/appSetup/Role");
const User = require("../models/access/User");
const { getBotListFields, getInitialValues, cardReplace } = require("./config");

const fs = require("fs");
const path = require("path");
const utils = require("util");
const puppeteer = require("puppeteer");
const hb = require("handlebars");
const readFile = utils.promisify(fs.readFile);
const sendEmail = require("../utils/sendEmail");
const sendEmail1 = require("../utils/sendEmailProd");
var request = require("request");
module.exports = {
  checkApplicationID: function (a) {
    return cKey;
  },
  checkMultiAttachments: function (a) {
    if (!a) {
      a = { items: [] };
    }
    return a;
  },
};
