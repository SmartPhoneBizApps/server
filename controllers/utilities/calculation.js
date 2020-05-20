const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const App = require("../../models/appSetup/App");
const Role = require("../../models/appSetup/Role");
const calfunction = require("../../models/utilities/calfunction.js");
// @desc      Perform Calculations
// @route     GET /api/v1/util/calculation
// @access    Private (Application Users)

// var aa = new calfunction();
// console.log(aa.Handler[ADD1()]);
// return false;

exports.getcalculation = asyncHandler(async (req, res, next) => {
  // Get App from Header
  const BodyApp = await App.findOne({
    applicationID: req.headers.applicationid,
  });
  req.body.appId = BodyApp.id;
  req.body.applicationId = req.headers.applicationid;
  if (!req.body.appId) {
    return next(new ErrorResponse(`Please provide App ID(Header)`, 400));
  }

  // Get Role from the Header
  const BusinessRole = await Role.findOne({
    applicationID: req.headers.businessrole,
  });
  if (!req.headers.businessrole) {
    return next(new ErrorResponse(`Please provide Role(Header)`, 400));
  }
  // Read Card Configuration for the Role (X1)
  let fn1 =
    "../../NewConfig/" +
    req.headers.applicationid +
    "_" +
    req.headers.businessrole +
    "_config.json";
  var appconfig = require(fn1);

  let config = appconfig["CalculatedFields"];
  let outdata = req.body;
  // Divyesh to add the code here
  // Config contains calculated fields
  // req.body contains the business data
  // update all the calculated fields and set them in outdata

  // calfunction = new calfunction();

  var Handler = new calfunction();

  if (outdata["ItemData"].length > 0) {
    // check item data exist in user input
    if (config["Item"].length > 0) {
      // Check item calculation is exist or not
      for (var i = 0; i < outdata["ItemData"].length; i++) {
        // loop ItemData array
        config["Item"].forEach((configItem) => {
          // loop config Item
          var fieldObj = [];
          configItem["Fields"].forEach((field) => {
            // push field value in obj
            fieldObj.push(outdata["ItemData"][i][field["Source"]]); // get calculated field value in item array
          });
          var fun = configItem["CalculatedFormula"]["function"]; // get function name

          if (typeof Handler[fun] !== "undefined") {
            // Check function exist or not
            console.log(fun);
            console.log(fieldObj);
            console.log(Handler[fun](fieldObj));
            outdata["ItemData"][i][
              configItem["CalculatedFormula"]["Target"]
            ] = Handler[fun](fieldObj); // call function and assign value in item array
          } else {
            outdata["ItemData"][i][configItem["CalculatedFormula"]["Target"]] =
              "";
          }
        });
      }
    }
  }
  if (config["HeaderItem"].length > 0) {
    // Check header item calculation is exist or not
    if (outdata["ItemData"].length > 0) {
      // Check item is not null
      config["HeaderItem"].forEach((configItem) => {
        // loop  config HeaderItem
        var fieldObj = [];
        for (var i = 0; i < outdata["ItemData"].length; i++) {
          // loop ItemData
          fieldObj.push(
            outdata["ItemData"][i][configItem["Fields"][0]["Source"]]
          ); // get calculated field value from all items
        }
        var fun = configItem["CalculatedFormula"]["function"]; // get function name
        if (typeof Handler[fun] !== "undefined") {
          // Check function exist or not
          console.log(fun);
          console.log(fieldObj);
          console.log(Handler[fun](fieldObj));
          outdata[configItem["CalculatedFormula"]["Target"]] = Handler[fun](
            fieldObj
          ); // call function and assign value in header array
        } else {
          outdata[configItem["CalculatedFormula"]["Target"]] = "";
        }
      });
    }
  }
  if (config["Header"].length > 0) {
    // Check Header calculation is exist or not
    config["Header"].forEach((configItem) => {
      // loop config header
      var fieldObj = [];
      configItem["Fields"].forEach((field) => {
        // loop for calculated field NOTE: here we can add multiple field
        fieldObj.push(outdata[field["Source"]]); // get calculated field value
      });
      var fun = configItem["CalculatedFormula"]["function"]; // get function name
      if (typeof Handler[fun] !== "undefined") {
        // Check function exist or not
        outdata[configItem["CalculatedFormula"]["Target"]] = Handler[fun](
          fieldObj
        ); // call function and assign value in header array
      } else {
        outdata[configItem["CalculatedFormula"]["Target"]] = "";
      }
    });
  }

  res.status(201).json({
    success: true,
    data: outdata,
    config: config,
    app: req.headers.applicationid,
    role: req.headers.businessrole,
  });
});
