const ErrorResponse = require("../../utils/errorResponse");
const Role = require("../../models/appSetup/Role");
const Approle = require("../../models/appSetup/Approle");
const { gerCardData } = require("../../modules/config");

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
    //  let fileName1 = "../../cards/cardConfig/" + role.role + "_cardTabs.json";
    let fileName1 = "../../cards/cardConfig/" + role.role + "_cardTabs.json";
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
                  console.log("Card Data : ", applicationID, results);
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

                    console.log("Card Template : ", fileName3);

                    key = {};
                    key["con" + con] = require(fileName3);
                    //-------------------------------------------------

                    //Set Header ... All Cards
                    key["con" + con]["sap.card"]["header"] =
                      tabCX[tab].Tiles[key3].header;
                    console.log(
                      "Card Header : ",
                      tabCX[tab].Tiles[key3].header
                    );
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

                    //
                    if (
                      tabCX[tab].Tiles[key3].Type.includes("TRAIN007_list2A")
                    ) {
                      //   if (tabCX[tab].Tiles[key3].Type == "list2A") {
                      key["con" + con]["sap.card"]["content"]["item"][
                        "actions"
                      ] = tabCX[tab].Tiles[key3].actions;
                      /// Add Data
                      jsonOut = {};
                      jsonOutArray = [];
                      name1 = tabCX[tab].Tiles[key3].fieldMap["ReferenceID"];
                      console.log(name1);
                      description1 = tabCX[tab].Tiles[key3].fieldMap["Title"];
                      console.log(description1);
                      icon1 = tabCX[tab].Tiles[key3].fieldMap["icon"];
                      k = 0;
                      jsonArray["json" + con].forEach((eln1) => {
                        jsonOut["ReferenceID"] = eln1[name1];
                        jsonOut["Title"] = eln1[description1];
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
                      console.log("Card Template : ", myD);
                    }

                    //  if (tabCX[tab].Tiles[key3].Type.includes("list2A")) {
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
                      console.log("Card Template : ", myD);
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

                    //Donut
                    if (tabCX[tab].Tiles[key3].Type == "donut1A") {
                      jsonOut = {};
                      jsonOutArray = [];

                      jsonOut["measureName"] = "Learning Completed";
                      jsonOut["value"] = 8;
                      measures.push({ ...jsonOut });

                      jsonOut["measureName"] = "Learning Due";
                      jsonOut["value"] = 4;
                      measures.push({ ...jsonOut });

                      myX["json"]["measures"] = measures;
                      key["con" + con]["sap.card"]["content"]["data"] = {
                        ...myX,
                      };
                      myX = { json: {}, path: "/measures" };
                      measures = [];

                      /// Add Data

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
