const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const User = require("../../models/access/User");
const Approle = require("../../models/appSetup/Approle");
const { gerCardData } = require("../../modules/config");
/* const BUS0000001 = require("../../models/smartApp/BUS0000002");
const BUS0000002 = require("../../models/smartApp/BUS0000002");
const BUS0000003 = require("../../models/smartApp/BUS0000003");
const BUS0000004 = require("../../models/smartApp/BUS0000004");
const BUS0000005 = require("../../models/smartApp/BUS0000005");
const BUS0000006 = require("../../models/smartApp/BUS0000006");
const COUNCIL001 = require("../../models/smartApp/COUNCIL001");
const COUNCIL002 = require("../../models/smartApp/COUNCIL002");
const COUNCIL003 = require("../../models/smartApp/COUNCIL003");
const COUNCIL007 = require("../../models/smartApp/COUNCIL007");
const COUNCIL012 = require("../../models/smartApp/COUNCIL012");
const COUNCIL015 = require("../../models/smartApp/COUNCIL015");
const COUNCIL022 = require("../../models/smartApp/COUNCIL022");
const COUNCIL023 = require("../../models/smartApp/COUNCIL023");
const COUNCIL026 = require("../../models/smartApp/COUNCIL026");
const COUNCIL029 = require("../../models/smartApp/COUNCIL029");
const COUNCIL033 = require("../../models/smartApp/COUNCIL033");
const COUNCIL034 = require("../../models/smartApp/COUNCIL034");
const COUNCIL035 = require("../../models/smartApp/COUNCIL035");
const COUNCIL036 = require("../../models/smartApp/COUNCIL036");
const DOC00001 = require("../../models/smartApp/DOC00001");
const DOC00002 = require("../../models/smartApp/DOC00002");
const DOC00003 = require("../../models/smartApp/DOC00003");
const EDU00001 = require("../../models/smartApp/EDU00001");
const EDU00002 = require("../../models/smartApp/EDU00002");
const EDU00003 = require("../../models/smartApp/EDU00003");
const EDU00004 = require("../../models/smartApp/EDU00004");
const EDU00005 = require("../../models/smartApp/EDU00005");
const EDU00006 = require("../../models/smartApp/EDU00006");
const EDU00007 = require("../../models/smartApp/EDU00007");
const EDU00008 = require("../../models/smartApp/EDU00008");
const EDU00009 = require("../../models/smartApp/EDU00009");
const EDU00010 = require("../../models/smartApp/EDU00010");
const EDU00011 = require("../../models/smartApp/EDU00011");
const EDU00013 = require("../../models/smartApp/EDU00013");
const EDU00014 = require("../../models/smartApp/EDU00014");
const EDU00015 = require("../../models/smartApp/EDU00015");
const EDU00016 = require("../../models/smartApp/EDU00016");
const EDU00018 = require("../../models/smartApp/EDU00018");
const EDU00019 = require("../../models/smartApp/EDU00019");
const EDU00021 = require("../../models/smartApp/EDU00021");
const EDU00097 = require("../../models/smartApp/EDU00097");
const EDU00098 = require("../../models/smartApp/EDU00098");
const EDU0100 = require("../../models/smartApp/EDU0100");
const EMP00001 = require("../../models/smartApp/EMP00001");
const EMP00002 = require("../../models/smartApp/EMP00002");
const EMP00004 = require("../../models/smartApp/EMP00004");
const EMP00006 = require("../../models/smartApp/EMP00006");
const EMP00006OLD = require("../../models/smartApp/EMP00006OLD");
const EMP00008 = require("../../models/smartApp/EMP00008");
const EMP00013 = require("../../models/smartApp/EMP00013");
const EMP00021 = require("../../models/smartApp/EMP00021");
const EMPACC01 = require("../../models/smartApp/EMPACC01");
const EMPBOK01 = require("../../models/smartApp/EMPBOK01");
const ERP00002 = require("../../models/smartApp/ERP00002");
const ERP00003 = require("../../models/smartApp/ERP00003");
const ERP00004 = require("../../models/smartApp/ERP00004");
const ERP00005 = require("../../models/smartApp/ERP00005");
const ERP00008 = require("../../models/smartApp/ERP00008");
const ERP00009 = require("../../models/smartApp/ERP00009");
const ERP00010 = require("../../models/smartApp/ERP00010");
const ERP00014 = require("../../models/smartApp/ERP00014");
const HOSP0003 = require("../../models/smartApp/HOSP0003");
const HOSP0004 = require("../../models/smartApp/HOSP0004");
const ITPROJ002 = require("../../models/smartApp/ITPROJ002");
const JOB00001 = require("../../models/smartApp/JOB00001");
const LOG00001 = require("../../models/smartApp/LOG00001");
const LOG00002 = require("../../models/smartApp/LOG00002");
const LOG00003 = require("../../models/smartApp/LOG00003");
const LOG00004 = require("../../models/smartApp/LOG00004");
const PM00001 = require("../../models/smartApp/PM00001");
const SUPP00011 = require("../../models/smartApp/SUPP00011");
const SUPP00012 = require("../../models/smartApp/SUPP00012");
const SUPP00013 = require("../../models/smartApp/SUPP00013");
const SUPP00014 = require("../../models/smartApp/SUPP00014");
const SUPP00015 = require("../../models/smartApp/SUPP00015");
const SUPP00016 = require("../../models/smartApp/SUPP00016");
const SUPP00018 = require("../../models/smartApp/SUPP00018");
const SUPP00028 = require("../../models/smartApp/SUPP00028");
const TRAIN008 = require("../../models/smartApp/TRAIN008");
const TRAIN007 = require("../../models/smartApp/TRAIN007"); */
let myD = { json: [] };
let myO = { json: {} };
con = 0;
jsonArray = [];
jsonObject = {};
myTiles = {};
counter = 0;
tabCX = {};
const cardTemplate = {};

const { getAdaptiveCard, getCalendarCard } = require("../../modules/config");

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.adaptiveCard_card = async (req, res, next) => {
  const role = await Role.findOne({
    role: req.params.role,
  });
  tab = req.params.tab;
  console.log("OverviewCard/RoleAccess : ", role.roleAccess);
  //Validate Data...
  if (role.roleAccess != "External") {
    if (!req.user.company) {
      return next(
        new ErrorResponse(
          `User setup for Company is not complete ${req.user.email}`,
          404
        )
      );
    }
    if (
      !req.user.branch &
      (req.user.role == "BranchAdmin" || req.user.role == "BranchUser")
    ) {
      return next(
        new ErrorResponse(
          `User setup for Branch is not complete ${req.user.email}`,
          404
        )
      );
    }
    if (
      !req.user.area &
      (req.user.role == "AreaAdmin" || req.user.role == "AreaUser")
    ) {
      return next(
        new ErrorResponse(
          `User setup for Area is not complete ${req.user.email}`,
          404
        )
      );
    }
  }

  // Get Role/App details..
  const roleApp = await Approle.findOne({ role: req.params.role });

  // Read Card Configuration for the Role (X1)
  let fileName = "../../cards/cardConfig/" + role.role + "_cardConfig.json";
  var cardConfig = require(fileName);
  console.log("OverviewCard/CardConfig : ", fileName);

  // Read Color Configuration
  let fileNameColor = "../../cards/cardConfig/colorConfig.json";
  var colorConfig = require(fileNameColor);

  // Read card User Settings  for the Role
  let fileName2 = "../../userSettings/" + req.user.email + "_cardsSetup.json";
  var userSetCards = require(fileName2);
  console.log("OverviewCard/UserSettings : ", fileName2);

  // When tab is "Tab1", a full template with Tab1 data will be returned, for all other cases on data for that tab
  if (tab == "Tab1") {
    let fileName1 = "../../cards/cardConfig/" + role.role + "_cardTabs.json";
    console.log("OverviewCard/TabConfig : ", fileName1);
    var cardTemplate = require(fileName1);
  } else {
    cardTemplate = {};
  }

  // Loop Card Configuration for the Role (X1)
  for (const k2 in cardConfig.Tabs) {
    // Filter the Card Configuration data for the request tab (Tab1, tab2 etc..)
    if (
      cardConfig.Tabs.hasOwnProperty(k2) &
      (cardConfig.Tabs[k2].TabID == tab)
    ) {
      tabCX[tab] = { ...cardConfig.Tabs[k2] };

      // data for the requested tab is found in the Card Configuration
      // Now loop through Tiles... in Card Configuration
      for (const key3 in tabCX[tab].Tiles) {
        if (tabCX[tab].Tiles.hasOwnProperty(key3)) {
          // Card / Tile found

          const configCardID = tabCX[tab].Tiles[key3].CardID;

          // Filtering the userSettings data based on application ID
          myData =
            userSetCards[role.role][tabCX[tab].Tiles[key3].applicationID];

          // Looping the USers Settings data
          for (const key4 in myData) {
            if (myData.hasOwnProperty(key4) & (myData[key4] == true)) {
              if (key4 == configCardID) {
                //////////////////////////////////////////////////////////////////////////////
                // Here user setup is matched with the card setup... Build the card output
                //////////////////////////////////////////////////////////////////////////////
                con = con + 1;
                let applicationID = tabCX[tab].Tiles[key3].applicationID;
                qx1 = {};

                if (tabCX[tab].Tiles[key3].Type == "Calendar1") {
                  var calendarCard = await getCalendarCard(
                    applicationID,
                    req.params.role
                  );
                  console.log(calendarCard);
                }

                if (tabCX[tab].Tiles[key3].Type == "Adaptive1") {
                  var cardData = await getAdaptiveCard(
                    applicationID,
                    req.params.role
                  );
                  console.log(cardData);
                }

                // User can see data only for there own company (User Specific is TRUE)
                if (role.roleAccess != "External") {
                  qx1 = { ...tabCX[tab].Tiles[key3].filters };
                  switch (req.user.role) {
                    case "CompanyAdmin":
                      qx1["company"] = req.user.company;
                      break;
                    case "CompanyUser":
                      qx1["company"] = req.user.company;
                      break;
                    case "BranchAdmin":
                      qx1["company"] = req.user.company;
                      qx1["branch"] = req.user.branch;
                      break;
                    case "BranchUser":
                      qx1["company"] = req.user.company;
                      qx1["branch"] = req.user.branch;
                      break;
                    case "AreaAdmin":
                      qx1["company"] = req.user.company;
                      qx1["area"] = req.user.area;
                      break;
                    case "AreaUser":
                      qx1["company"] = req.user.company;
                      qx1["area"] = req.user.area;
                      break;
                    default:
                      qx1["company"] = req.user.company;
                      qx1["area"] = req.user.area;
                      qx1["branch"] = req.user.branch;
                  }
                }

                roleApp["Apps"].forEach((roleApp1) => {
                  if (roleApp1["applicationID"] == applicationID) {
                    if (roleApp1["userSpecific"]) {
                      // User can see only there own data (User Specific is TRUE)
                      qx1["user"] = req.user.id;
                    }
                    if (req.user.userAccess == "External") {
                      qx1["partner"] = req.user.id;
                    }
                  }
                });
                let q1 = { ...qx1 };
                q1 = JSON.stringify(q1);
                let query;
                if (applicationID == "MYDATA") {
                } else {
                  query = gerCardData(applicationID, q1);

                  /*                   switch (applicationID) {
                    case "MYDATA":
                      // code block
                      break;

                    case "BUS0000001":
                      qg1 = JSON.parse(q1);
                      query = BUS0000001.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN008":
                      qg1 = JSON.parse(q1);
                      query = TRAIN008.find(qg1, { _id: 0 });
                      break;
                    case "BUS0000002":
                      qg1 = JSON.parse(q1);
                      query = BUS0000002.find(qg1, { _id: 0 });
                      break;
                    case "BUS0000003":
                      qg1 = JSON.parse(q1);
                      query = BUS0000003.find(qg1, { _id: 0 });
                      break;
                    case "BUS0000004":
                      qg1 = JSON.parse(q1);
                      query = BUS0000004.find(qg1, { _id: 0 });
                      break;
                    case "BUS0000005":
                      qg1 = JSON.parse(q1);
                      query = BUS0000005.find(qg1, { _id: 0 });
                      break;
                    case "BUS0000006":
                      qg1 = JSON.parse(q1);
                      query = BUS0000006.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL001":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL001.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL002":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL002.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL003":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL003.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL007":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL007.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL012":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL012.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL015":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL015.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL022":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL022.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL023":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL023.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL026":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL026.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL029":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL029.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL033":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL033.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL034":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL034.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL035":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL035.find(qg1, { _id: 0 });
                      break;
                    case "COUNCIL036":
                      qg1 = JSON.parse(q1);
                      query = COUNCIL036.find(qg1, { _id: 0 });
                      break;
                    case "DOC00001":
                      qg1 = JSON.parse(q1);
                      query = DOC00001.find(qg1, { _id: 0 });
                      break;
                    case "DOC00002":
                      qg1 = JSON.parse(q1);
                      query = DOC00002.find(qg1, { _id: 0 });
                      break;
                    case "DOC00003":
                      qg1 = JSON.parse(q1);
                      query = DOC00003.find(qg1, { _id: 0 });
                      break;
                    case "EDU00001":
                      qg1 = JSON.parse(q1);
                      query = EDU00001.find(qg1, { _id: 0 });
                      break;
                    case "EDU00002":
                      qg1 = JSON.parse(q1);
                      query = EDU00002.find(qg1, { _id: 0 });
                      break;
                    case "EDU00003":
                      qg1 = JSON.parse(q1);
                      query = EDU00003.find(qg1, { _id: 0 });
                      break;
                    case "EDU00004":
                      qg1 = JSON.parse(q1);
                      query = EDU00004.find(qg1, { _id: 0 });
                      break;
                    case "EDU00005":
                      qg1 = JSON.parse(q1);
                      query = EDU00005.find(qg1, { _id: 0 });
                      break;
                    case "EDU00006":
                      qg1 = JSON.parse(q1);
                      query = EDU00006.find(qg1, { _id: 0 });
                      break;
                    case "EDU00007":
                      qg1 = JSON.parse(q1);
                      query = EDU00007.find(qg1, { _id: 0 });
                      break;
                    case "EDU00008":
                      qg1 = JSON.parse(q1);
                      query = EDU00008.find(qg1, { _id: 0 });
                      break;
                    case "EDU00009":
                      qg1 = JSON.parse(q1);
                      query = EDU00009.find(qg1, { _id: 0 });
                      break;
                    case "EDU00010":
                      qg1 = JSON.parse(q1);
                      query = EDU00010.find(qg1, { _id: 0 });
                      break;
                    case "EDU00011":
                      qg1 = JSON.parse(q1);
                      query = EDU00011.find(qg1, { _id: 0 });
                      break;
                    case "EDU00013":
                      qg1 = JSON.parse(q1);
                      query = EDU00013.find(qg1, { _id: 0 });
                      break;
                    case "EDU00014":
                      qg1 = JSON.parse(q1);
                      query = EDU00014.find(qg1, { _id: 0 });
                      break;
                    case "EDU00015":
                      qg1 = JSON.parse(q1);
                      query = EDU00015.find(qg1, { _id: 0 });
                      break;
                    case "EDU00016":
                      qg1 = JSON.parse(q1);
                      query = EDU00016.find(qg1, { _id: 0 });
                      break;
                    case "EDU00018":
                      qg1 = JSON.parse(q1);
                      query = EDU00018.find(qg1, { _id: 0 });
                      break;
                    case "EDU00019":
                      qg1 = JSON.parse(q1);
                      query = EDU00019.find(qg1, { _id: 0 });
                      break;
                    case "EDU00021":
                      qg1 = JSON.parse(q1);
                      query = EDU00021.find(qg1, { _id: 0 });
                      break;
                    case "EDU00097":
                      qg1 = JSON.parse(q1);
                      query = EDU00097.find(qg1, { _id: 0 });
                      break;
                    case "EDU00098":
                      qg1 = JSON.parse(q1);
                      query = EDU00098.find(qg1, { _id: 0 });
                      break;
                    case "EDU0100":
                      qg1 = JSON.parse(q1);
                      query = EDU0100.find(qg1, { _id: 0 });
                      break;
                    case "EMP00001":
                      qg1 = JSON.parse(q1);
                      query = EMP00001.find(qg1, { _id: 0 });
                      break;
                    case "EMP00002":
                      qg1 = JSON.parse(q1);
                      query = EMP00002.find(qg1, { _id: 0 });
                      break;
                    case "EMP00004":
                      qg1 = JSON.parse(q1);
                      query = EMP00004.find(qg1, { _id: 0 });
                      break;
                    case "EMP00006OLD":
                      qg1 = JSON.parse(q1);
                      query = EMP00006OLD.find(qg1, { _id: 0 });
                      break;
                    case "EMP00006":
                      qg1 = JSON.parse(q1);
                      query = EMP00006.find(qg1, { _id: 0 });
                      break;
                    case "EMP00008":
                      qg1 = JSON.parse(q1);
                      query = EMP00008.find(qg1, { _id: 0 });
                      break;
                    case "EMP00013":
                      qg1 = JSON.parse(q1);
                      query = EMP00013.find(qg1, { _id: 0 });
                      break;
                    case "EMP00021":
                      qg1 = JSON.parse(q1);
                      query = EMP00021.find(qg1, { _id: 0 });
                      break;
                    case "EMPACC01":
                      qg1 = JSON.parse(q1);
                      query = EMPACC01.find(qg1, { _id: 0 });
                      break;
                    case "EMPBOK01":
                      qg1 = JSON.parse(q1);
                      query = EMPBOK01.find(qg1, { _id: 0 });
                      break;
                    case "ERP00002":
                      qg1 = JSON.parse(q1);
                      query = ERP00002.find(qg1, { _id: 0 });
                      break;
                    case "ERP00003":
                      qg1 = JSON.parse(q1);
                      query = ERP00003.find(qg1, { _id: 0 });
                      break;
                    case "ERP00004":
                      qg1 = JSON.parse(q1);
                      query = ERP00004.find(qg1, { _id: 0 });
                      break;
                    case "ERP00005":
                      qg1 = JSON.parse(q1);
                      query = ERP00005.find(qg1, { _id: 0 });
                      break;
                    case "ERP00008":
                      qg1 = JSON.parse(q1);
                      query = ERP00008.find(qg1, { _id: 0 });
                      break;
                    case "ERP00009":
                      qg1 = JSON.parse(q1);
                      query = ERP00009.find(qg1, { _id: 0 });
                      break;
                    case "ERP00010":
                      qg1 = JSON.parse(q1);
                      query = ERP00010.find(qg1, { _id: 0 });
                      break;
                    case "ERP00014":
                      qg1 = JSON.parse(q1);
                      query = ERP00014.find(qg1, { _id: 0 });
                      break;
                    case "HOSP0003":
                      qg1 = JSON.parse(q1);
                      query = HOSP0003.find(qg1, { _id: 0 });
                      break;
                    case "HOSP0004":
                      qg1 = JSON.parse(q1);
                      query = HOSP0004.find(qg1, { _id: 0 });
                      break;
                    case "ITPROJ002":
                      qg1 = JSON.parse(q1);
                      query = ITPROJ002.find(qg1, { _id: 0 });
                      break;
                    case "JOB00001":
                      qg1 = JSON.parse(q1);
                      query = JOB00001.find(qg1, { _id: 0 });
                      break;
                    case "LOG00001":
                      qg1 = JSON.parse(q1);
                      query = LOG00001.find(qg1, { _id: 0 });
                      break;
                    case "LOG00002":
                      qg1 = JSON.parse(q1);
                      query = LOG00002.find(qg1, { _id: 0 });
                      break;
                    case "LOG00003":
                      qg1 = JSON.parse(q1);
                      query = LOG00003.find(qg1, { _id: 0 });
                      break;
                    case "LOG00004":
                      qg1 = JSON.parse(q1);
                      query = LOG00004.find(qg1, { _id: 0 });
                      break;
                    case "PM00001":
                      qg1 = JSON.parse(q1);
                      query = PM00001.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00011":
                      qg1 = JSON.parse(q1);
                      query = SUPP00011.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00012":
                      qg1 = JSON.parse(q1);
                      query = SUPP00012.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00013":
                      qg1 = JSON.parse(q1);
                      query = SUPP00013.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00014":
                      qg1 = JSON.parse(q1);
                      query = SUPP00014.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00015":
                      qg1 = JSON.parse(q1);
                      query = SUPP00015.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00016":
                      qg1 = JSON.parse(q1);
                      query = SUPP00016.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00018":
                      qg1 = JSON.parse(q1);
                      query = SUPP00018.find(qg1, { _id: 0 });
                      break;
                    case "SUPP00028":
                      qg1 = JSON.parse(q1);
                      query = SUPP00028.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN001":
                      qg1 = JSON.parse(q1);
                      query = TRAIN001.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN002":
                      qg1 = JSON.parse(q1);
                      query = TRAIN002.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN003":
                      qg1 = JSON.parse(q1);
                      query = TRAIN003.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN004":
                      qg1 = JSON.parse(q1);
                      query = TRAIN004.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN005":
                      qg1 = JSON.parse(q1);
                      query = TRAIN005.find(qg1, { _id: 0 });
                      break;
                    case "TRAIN006":
                      qg1 = JSON.parse(q1);
                      query = TRAIN006.find(qg1, { _id: 0 });
                    case "TRAIN007":
                      qg1 = JSON.parse(q1);
                      query = TRAIN007.find(qg1, { _id: 0 });
                    case "TRAIN008":
                      qg1 = JSON.parse(q1);
                      query = TRAIN008.find(qg1, { _id: 0 });
                      break;
                    default:
                    // code block
                  } */

                  // Select Fields
                  const fList = [];
                  if (tabCX[tab].Tiles[key3].fieldList) {
                    console.log("AG:", query);
                    const fields = tabCX[tab].Tiles[key3].fieldList;
                    query = query.select(fields);
                    const fList = tabCX[tab].Tiles[key3].fieldList.split(" ");
                  }
                  //Sorting
                  if (tabCX[tab].Tiles[key3].sortBy) {
                    const sortBy = tabCX[tab].Tiles[key3].sortBy;
                    query = query.sort(sortBy);
                  } else {
                    query = query.sort("-createdAt");
                  }
                  // Check Limits
                  if (tabCX[tab].Tiles[key3].limit) {
                    const limit =
                      parseInt(tabCX[tab].Tiles[key3].limit, 10) || 5;
                    const startIndex = 0;
                    query = query.skip(startIndex).limit(limit);
                  }
                  // Populate connected fields
                  if (tabCX[tab].Tiles[key3].populate) {
                    query = query.populate(populate);
                  }
                  // Get data
                  let results = await query;
                  jsonArray["json" + con] = results;
                }
                key = {};
                if (tabCX[tab].Tiles[key3].Type != "Adaptive1") {
                  if (tabCX[tab].Tiles[key3].Type != "Calendar1") {
                    // Read Card Template
                    let fileName3 =
                      "../../cards/templates/" +
                      tabCX[tab].Tiles[key3].Type +
                      "_template.json";
                    key = {};
                    key["con" + con] = require(fileName3);
                    //-------------------------------------------------

                    //Set Header ... All Cards
                    key["con" + con]["sap.card"]["header"] =
                      tabCX[tab].Tiles[key3].header;

                    //-------------------------------------------------
                    //object1 : set group
                    if (tabCX[tab].Tiles[key3].Type == "object1") {
                      key["con" + con]["sap.card"]["content"]["groups"][key3] =
                        tabCX[tab].Tiles[key3].groups;
                      // Add Data
                      let jg01 = {
                        name: "Atul Gupta",
                        position: "Director",
                        mobile: "+1 202 34869-0",
                        phone: "+1 202 555 5555",
                        email: "donna@peachvalley.com",
                      };
                      myO["json"] = { ...jg01 };
                      key["con" + con]["sap.card"]["data"] = { ...myO };
                      myO = {};
                    }
                    //-------------------------------------------------
                    //table1
                    if (tabCX[tab].Tiles[key3].Type == "table1A") {
                      ///// Set Coloumns ////////
                      key["con" + con]["sap.card"]["content"]["row"][
                        "columns"
                      ] = tabCX[tab].Tiles[key3].columns.slice(0);

                      /// Add JSON Data
                      key["con" + con]["sap.card"]["data"]["json"] = jsonArray[
                        "json" + con
                      ].slice(0);
                    }
                    //-------------------------------------------------
                    //table1
                    if (tabCX[tab].Tiles[key3].Type == "table1B") {
                      ///// Set Coloumns ////////
                      key["con" + con]["sap.card"]["content"]["row"][
                        "columns"
                      ] = tabCX[tab].Tiles[key3].columns.slice(0);
                      /// Add JSON Data
                      jl1 = {};
                      jsonArray["json" + con].forEach((ex2) => {
                        jl1 = ex2;
                        jl1["statusState"] =
                          colorConfig["Status"][ex2["Status"]];
                      });
                      key["con" + con]["sap.card"]["data"]["json"] = jsonArray[
                        "json" + con
                      ].slice(0);
                    }
                    //--------------------
                    //set group for action card
                    //object1
                    if (tabCX[tab].Tiles[key3].Type == "object1") {
                      key["con" + con]["sap.card"]["content"]["actions"] =
                        tabCX[tab].Tiles[key3].actions;
                    }
                    //list2 - Actions
                    if (tabCX[tab].Tiles[key3].Type == "list2A") {
                      key["con" + con]["sap.card"]["content"]["item"][
                        "actions"
                      ] = tabCX[tab].Tiles[key3].actions;
                      /// Add Data
                      jsonOut = {};
                      jsonOutArray = [];
                      name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                      description1 =
                        tabCX[tab].Tiles[key3].fieldMap["description"];
                      icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                      k = 0;
                      jsonArray["json" + con].forEach((eln1) => {
                        jsonOut["name"] = eln1[name1];
                        jsonOut["description"] = eln1[description1];
                        jsonOut["icon"] = icon1;
                        jsonOut["statusState"] =
                          colorConfig["Status"][eln1["Status"]];
                        jsonOutArray.push({ ...jsonOut });
                      });
                      /// Add Data
                      myD["json"] = jsonOutArray;
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myD,
                      };
                      jsonArray["json" + con] = [];
                    }
                    //list2 - Actions
                    if (tabCX[tab].Tiles[key3].Type == "list2B") {
                      key["con" + con]["sap.card"]["content"]["item"][
                        "actions"
                      ] = tabCX[tab].Tiles[key3].actions;
                      /// Add Data
                      myD["json"] = jsonArray["json" + con];
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myD,
                      };
                      jsonArray["json" + con] = [];
                    }
                    //list1 - Data
                    if (tabCX[tab].Tiles[key3].Type == "list1A") {
                      jsonOut = {};
                      jsonOutArray = [];
                      name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                      description1 =
                        tabCX[tab].Tiles[key3].fieldMap["description"];
                      info1 = tabCX[tab].Tiles[key3].fieldMap["info"];
                      icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                      k = 0;
                      jsonArray["json" + con].forEach((eln1) => {
                        jsonOut["name"] = eln1[name1];
                        jsonOut["description"] = eln1[description1];
                        jsonOut["info"] = eln1[info1];
                        jsonOut["icon"] = icon1;
                        jsonOut["infoState"] =
                          colorConfig["Status"][eln1["Status"]];
                        jsonOutArray.push({ ...jsonOut });
                      });
                      /// Add Data
                      myD["json"] = jsonOutArray;
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myD,
                      };
                      jsonArray["json" + con] = [];
                    }
                    //list1 - Data
                    if (tabCX[tab].Tiles[key3].Type == "list1B") {
                      jsonOut = {};
                      jsonOutArray = [];
                      name1 = tabCX[tab].Tiles[key3].fieldMap["name"];
                      description1 =
                        tabCX[tab].Tiles[key3].fieldMap["description"];
                      info1 = tabCX[tab].Tiles[key3].fieldMap["info"];
                      icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                      k = 0;
                      jsonArray["json" + con].forEach((eln1) => {
                        jsonOut["name"] = eln1[name1];
                        jsonOut["description"] = eln1[description1];
                        jsonOut["info"] = eln1[info1];
                        jsonOut["icon"] = icon1;
                        jsonOut["infoState"] =
                          colorConfig["Status"][eln1["Status"]];
                        jsonOutArray.push({ ...jsonOut });
                      });
                      /// Add Data
                      myD["json"] = jsonOutArray;
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myD,
                      };
                      jsonArray["json" + con] = [];
                    }

                    if (
                      tabCX[tab].Tiles[key3].Type == "timeline1" ||
                      tabCX[tab].Tiles[key3].Type == "quicklinks1"
                    ) {
                      /// Add Data
                      myD["json"] = { ...jsonArray["json" + con] };
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myD,
                      };
                      jsonArray["json" + con] = [];
                    }
                  }
                }
                let TileID = "";
                switch (tabCX[tab].Tiles[key3].Type) {
                  case "Adaptive1":
                    counter = counter + 1;
                    TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                    myTiles[TileID] = Object.assign({}, cardData);
                    break;
                  case "Calendar1":
                    counter = counter + 1;
                    TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                    myTiles[TileID] = Object.assign({}, calendarCard);
                    break;

                  default:
                    counter = counter + 1;
                    TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                    myTiles[TileID] = Object.assign({}, key["con" + con]);
                    key["con" + con] = {};
                    break;
                }

                // if (tabCX[tab].Tiles[key3].Type == "Adaptive1") {
                //   counter = counter + 1;
                //   let TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                //   myTiles[TileID] = Object.assign({}, cardData);
                // } else {
                //   counter = counter + 1;
                //   let TileID = tabCX[tab].Tiles[key3].Type + "_" + counter;
                //   myTiles[TileID] = Object.assign({}, key["con" + con]);
                //   key["con" + con] = {};
                // }

                //////////////////////////////////////////////////////////////////////////////
                // Ends
                //////////////////////////////////////////////////////////////////////////////
              }
            }
          }
        }
      }
      /// Add Tiles in the output........
      if (tab != "Tab1") {
        cardTemplate = { ...myTiles };
        myTiles = {};
      } else {
        for (const l1 in cardTemplate["Tabs"]) {
          if (
            cardTemplate["Tabs"].hasOwnProperty(l1) &
            (cardTemplate["Tabs"][l1]["TabID"] == tab)
          ) {
            cardTemplate["Tabs"][l1]["Tiles"] = { ...myTiles };
            myTiles = {};
          }
        }
      }
    }
  }
  if (tab == "Tab1") {
    cardTemplate["Tabs"].forEach((element) => {});
  } else {
  }
  res.status(200).json({ success: true, data: cardTemplate });
  cardTemplate = [];
};
