const ErrorResponse = require("../../utils/errorResponse");
const asyncHandler = require("../../middleware/async");
const Approle = require("../../models/appSetup/Approle");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/access/User");
const { tileCount } = require("../../modules/config2");
const { getInitialValues, replaceConfig } = require("../../modules/config");

// @desc      Get all approles
// @route     GET /api/v1/userapps
// @access    Public
exports.getUserapps = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;

  // Finding Roles
  userX = await User.findById(req.body.user);
  i = 0;
  appTemp = {
    id: 0,
    icon: "",
    tileName: "",
    subTileName: "",
    applicationID: "",
    info: "",
    extraInfo: "",
    frameType: "",
    backgroundImage: "",
    footer: "",
    tileType: "",
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
    userSettings: [],
    Roles: [],
  };
  X1 = {};
  r = 0;
  // c4 = await User.aggregate([
  //   { $unwind: "$bRole" },
  //   {
  //     $lookup: {
  //       from: "Approle",
  //       localField: "bRole",
  //       foreignField: "role",
  //       as: "businessRoles1",
  //     },
  //   },
  //   //   { $unwind: "$businessRoles1" },
  //   {
  //     $group: {
  //       _id: "$role",
  //       bRole: { $push: "$bRole" },
  //       businessRoles1: { $push: "$businessRoles1" },
  //     },
  //   },
  // ]);
  // let path = "https://fierce-oasis-51455.herokuapp.com/appImages/";
  let path = process.env.APPURL + "appImages/";
  for (i = 0; i < userX.businessRoles.length; i++) {
    const approleX = await Approle.findOne({
      appRole: userX.businessRoles[i].roleId,
    });
    if (!approleX) {
      return next(
        new ErrorResponse(
          `user not setup for role - ${userX.businessRoles[i].role}`,
          400
        )
      );
    }
    const roleX = await Role.findById(userX.businessRoles[i].roleId);
    if (!roleX) {
      return next(
        new ErrorResponse(
          `role - ${userX.businessRoles[i].role} is not created`,
          400
        )
      );
    }

    roleTemp["tabId"] = r;
    r = r + 1;
    roleTemp["Role"] = approleX.role;
    roleTemp["RoleDescription"] = approleX.descriptions[0].RoleDescription;
    roleTemp["icon"] = "sap-icon://customer-view";
    roleTemp["iconToolTip"] = approleX.descriptions[0].iconToolTip;
    tile = [];
    appTemp["id"] = 0;
    appTemp["icon"] = "";
    appTemp["tileName"] = userX.businessRoles[i].role + " Overview Page";
    appTemp["subTileName"] = "";
    appTemp["info"] = "";
    appTemp["extraInfo"] = "";
    appTemp["frameType"] = "TwoByOne";
    appTemp["backgroundImage"] = path + roleX.photo;
    appTemp["footer"] = "";
    appTemp["applicationID"] = "Overview";
    appTemp["tileType"] = "Overview";
    tile[0] = { ...appTemp };
    for (j = 0; j < approleX.Apps.length; j++) {
      k = j + 1;
      appTemp["id"] = k;
      if (approleX.Apps[j]) {
        appTemp["icon"] = approleX.Apps[j].icon;
        appTemp["tileName"] = approleX.Apps[j].descriptions[0].appDescription;
        appTemp["subTileName"] = approleX.Apps[j].descriptions[0].area;
        appTemp["info"] = approleX.Apps[j].descriptions[0].appHelp;
        appTemp["extraInfo"] = "";
        if (approleX.Apps[j]["frameType"]) {
          appTemp["frameType"] = approleX.Apps[j].frameType;
        } else {
          appTemp["frameType"] = "OneByOne";
        }
        if (
          approleX.Apps[j]["backgroundImage"] !== "" &&
          appTemp["frameType"] == "TwoByOne"
        ) {
          appTemp["backgroundImage"] = path + approleX.Apps[j].backgroundImage;
          appTemp["icon"] = "";
        } else {
          appTemp["backgroundImage"] = "";
        }

        appTemp["footer"] = "";
        appTemp["userSpecific"] = approleX.Apps[j].userSpecific;
        appTemp["applicationID"] = approleX.Apps[j].applicationID;
        /////////////////////////
        let fn1 =
          "../../NewConfig/" +
          approleX.Apps[j].applicationID +
          "_" +
          approleX.role +
          "_config.json";
        var config1 = require(fn1);
        var config1 = replaceConfig(config1, req.user);

        /// Initial values..

        var ivalue = getInitialValues(
          approleX.Apps[j].applicationID,
          approleX.role,
          req.user
        );
        // Get total Count
        tCount = await tileCount(
          req,
          approleX.Apps[j].applicationID,
          config1,
          ivalue
        );
        appTemp["count"] = tCount;

        if (approleX.Apps[j] == undefined) {
          appTemp["Type"] = "MasterDetail";
          approleX.Apps[j].type = "masterList";
        }
        if (
          approleX.Apps[j].type == "filterData" ||
          approleX.Apps[j].type == "FilterData"
        ) {
          appTemp["Type"] = "FilterData";
        } else {
          appTemp["Type"] = "MasterDetail";
        }
        appTemp["tileType"] = "MasterDetail";
        tile[j + 1] = { ...appTemp };
      }
    }
    roleTemp["Tiles"] = tile;
    tile = [];
    myRoles[i] = roleTemp;
    roleTemp = {};
  }
  userData["Roles"] = myRoles;
  res.status(200).json(userData);
});
