const { getNewConfig } = require("../../modules/config");
// @desc      Perform Encoding
// @route     GET /api/v1/roles
// @access    Public
exports.botOptions = (req, res, next) => {
  var appconfig = getNewConfig(
    req.headers.applicationid,
    req.headers.businessrole
  );
  let buttons = [];
  let buttonx = {};
  let appDetail = {};
  let controls = {};

  var n = req.headers.applicationid.length - 3;
  kng =
    req.headers.applicationid.slice(0, 3) +
    "_" +
    req.headers.businessrole.slice(0, 3) +
    "_" +
    req.headers.applicationid.substr(n, 3);

  // App Details
  appDetail["AppID"] = req.headers.applicationid;
  appDetail["Role"] = req.headers.businessrole;
  appDetail["ApplicationTitle"] = appconfig["Title"]["ApplicationTitle"];
  // controlData
  controls["calculation"] = appconfig["Controls"]["calculation"];

  buttonx["title"] = "List";
  buttonx["type"] = "postBack";
  buttonx["payload"] = kng.toUpperCase() + "-" + "list";
  buttons.push({ ...buttonx });
  buttonx = {};

  for (let k = 0; k < appconfig["MButtons"].length; k++) {
    const el = appconfig["MButtons"][k];
    if (appconfig["MButtons"][k]["type"] == "ADD") {
      buttonx["title"] = "Create";
      buttonx["type"] = "web_url";
      buttonx["messenger_extensions"] = "true";
      buttonx["url"] =
        "https://smartphonebizapps.com/smartphoneappswebview/?view=wizard&app=" +
        req.headers.applicationid +
        "&role=" +
        req.headers.businessrole;

      buttonx["payload"] = kng.toUpperCase() + "-" + "create";
      buttons.push({ ...buttonx });
      buttonx = {};
    }
  }

  // buttonx["title"] = "Display";
  // buttonx["type"] = "postBack";
  // buttonx["payload"] = kng.toUpperCase() + "-" + "display";
  // buttons.push({ ...buttonx });
  // buttonx = {};

  res.status(200).json({
    success: true,
    buttons: buttons,
    appDetails: appDetail,
    //   controlData: controls,
  });
};
