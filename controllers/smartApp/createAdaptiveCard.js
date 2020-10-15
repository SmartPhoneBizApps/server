const asyncHandler = require("../../middleware/async");

const {
  getPVConfig,
  getPVQuery,
  getInitialValues,
  getDateValues,
  getNewConfig,
} = require("../../modules/config");
// @desc      Add record
// @route     POST /api/v1/datarecords/
// @access    Private
exports.createAdaptiveCard = asyncHandler(async (req, res, next) => {
  const applicationId = req.params.app;
  const businessrole = req.params.businessrole;

  // Config File
  var appconfig = getNewConfig(applicationId, businessrole);
  let cardConfigFile1 = "../../cards/cardConfig/template_adaptiveForm.json";
  let aCard = require(cardConfigFile1);

  /// Possible values..
  pvappconfig = getPVConfig(applicationId, businessrole);
  qPV = getPVQuery(applicationId, businessrole, pvappconfig);
  let resPV = await qPV;

  // Initial values
  var ivalue = getInitialValues(applicationId, businessrole, req.user);
  let ival_out = [];
  let ival = {};
  for (let i = 0; i < ivalue.length; i++) {
    ival = {};
    const element = ivalue[i];
    ival = { ...element };
    o_val = getDateValues(ival.Value);
    ival.Value = o_val;
    ival_out.push(ival);
  }
  body = [];
  body2 = [];
  body2 = [];
  body1x = {};
  body2x = {};

  for (let l = 0; l < appconfig["Wizard"].length; l++) {
    const rkg = appconfig["Wizard"][l];
    rkg["fields"].forEach((e1) => {
      if (e1["Mode"] == "Edit") {
        body2x["type"] = "TextBlock";
        body2x["text"] = e1["name"];
        body2x["isSubtle"] = true;
        body2x["size"] = "medium";
        body.push(body2x);
        body2x = {};

        body1x["type"] = "TextBlock";
        body1x["text"] = e1["name"];
        body1x["id"] = e1["name"];
        body.push(body1x);
        body1x = {};
      } else {
        body2x["type"] = "TextBlock";
        body2x["text"] = e1["name"];
        body2x["isSubtle"] = true;
        body2x["size"] = "medium";
        body2.push(body2x);
        body2x = {};

        body1x["type"] = "TextBlock";
        body1x["text"] = e1["name"];
        body1x["id"] = e1["name"];
        body2.push(body1x);
        body1x = {};
      }
    });
  }
  aCard["sap.card"]["content"]["body"] = body;
  for (let m = 0; m < aCard["sap.card"]["content"]["actions"].length; m++) {
    if (
      aCard["sap.card"]["content"]["actions"][m]["type"] == "Action.ShowCard"
    ) {
      aCard["sap.card"]["content"]["actions"][m]["card"]["body"] = body2;
    }
  }

  res.status(200).json({
    success: true,
    data: aCard,
  });
});
