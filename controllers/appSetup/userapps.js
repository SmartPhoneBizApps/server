const path = require("path");
const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Approle = require("../../models/appSetup/Approle");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/User");
const App = require("../../models/appSetup/App");

// @desc      Get all approles
// @route     GET /api/v1/userapps
// @access    Public
exports.getUserapps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  console.log("Ag 01:", req.user.id);
  // Finding Roles
  userX = await User.findById(req.body.user);

  console.log("Ag 02:", userX);
  i = 0;
  appTemp = {
    id: 0,
    icon: "",
    tileName: "",
    subTileName: "",
    info: "",
    extraInfo: "",
    frameType: "",
    backgroundImage: "",
    footer: "",
  };
  roleTemp = {
    tabId: 0,
    Role: "",
    RoleDescription: "",
    icon: "",
    iconToolTip: "",
    Tiles: [],
  };
  myRoles = [];
  userData = {
    UserSettings: [],
    Roles: [],
  };
  X1 = {};
  r = 0;
  for (i = 0; i < userX.businessRoles.length; i++) {
    const approleX = await Approle.findOne({
      appRole: userX.businessRoles[i].roleId,
    });

    roleTemp["tabId"] = r;
    r = r + 1;
    roleTemp["Role"] = approleX.role;
    roleTemp["RoleDescription"] = approleX.descriptions[0].RoleDescription;
    roleTemp["icon"] = "sap-icon://customer-view";
    roleTemp["iconToolTip"] = approleX.descriptions[0].iconToolTip;

    tile = [];

    appTemp["id"] = 0;
    appTemp["icon"] = "sap-icon://customer-view";
    appTemp["tileName"] = "Overview Page";
    appTemp["subTileName"] = userX.businessRoles[i];
    appTemp["info"] = "Overview Cards";
    appTemp["extraInfo"] = "Data Card based access";
    appTemp["frameType"] = "TwoByOne";
    appTemp["backgroundImage"] = "";
    appTemp["footer"] = "Quick Access";
    tile[0] = { ...appTemp };

    for (j = 0; j < approleX.Apps.length; j++) {
      k = j + 1;
      appTemp["id"] = k;
      appTemp["icon"] = approleX.Apps[j].icon;
      appTemp["tileName"] = approleX.Apps[j].descriptions[0].appDescription;
      appTemp["subTileName"] = approleX.Apps[j].descriptions[0].area;
      appTemp["info"] = approleX.Apps[j].descriptions[0].appHelp;
      appTemp["extraInfo"] = approleX.Apps[j].applicationID;
      appTemp["frameType"] = "OneByOne";
      appTemp["backgroundImage"] = "";
      appTemp["footer"] = approleX.Apps[j].applicationID;
      appTemp["userSpecific"] = approleX.Apps[j].userSpecific;
      console.log(appTemp);
      tile[j + 1] = { ...appTemp };
    }
    roleTemp["Tiles"] = tile;
    //console.log(roleTemp["Tiles"]);
    tile = [];
    myRoles[i] = roleTemp;
    roleTemp = {};
  }
  userData["Roles"] = myRoles;
  res.status(200).json(userData);
});
