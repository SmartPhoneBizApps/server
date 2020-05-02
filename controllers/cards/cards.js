const ErrorResponse = require("../../utils/errorResponse");
const Approle = require("../../models/appSetup/Approle");
const User = require("../../models/User");
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

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.adaptiveCard_card = async (req, res, next) => {
  // Some Global variables....
  jsonArray = [];
  jsonObject = {};
  myTiles = {};
  counter = 0;

  // Read Role from Parameter..
  role = req.params.role;
  tab = req.params.tab;

  // Get user details..
  const userRecord = await User.findById(req.user.id);

  // Read Card Configuration for the Role (X1)
  let fileName = "../../cards/cardConfig/" + role + "_cardConfig.json";
  var cardConfig = require(fileName);

  // Read card User Settings  for the Role
  let fileName2 = "../../userSettings/" + userRecord.email + "_cardsSetup.json";
  var userSetCards = require(fileName2);

  // When tab is "tab1" full template with tab1 data will be returned, for all other cases on data for that tab
  if (tab == "tab1") {
    let fileName1 = "../../cards/cardConfig/" + role + "_cardTabs.json";
    var cardTemplate = require(fileName1);
  } else {
    const cardTemplate = {};
  }

  // Loop Card Configuration for the Role (X1)
  for (const k1 in cardConfig) {
    if (cardConfig.hasOwnProperty(k1)) {
      for (const k2 in cardConfig.Tabs) {
        // Filter the Card Configuration data for the request tab (tab1, tab2 etc..)
        if (
          cardConfig.Tabs.hasOwnProperty(k2) &
          (cardConfig.Tabs[k2].TabID == tab)
        ) {
          // data for the requested tab is found in the Card Configuration
          const element2 = cardConfig.Tabs[k2];
          // Now loop through Tiles... in Card Configuration
          for (const key3 in element2.Tiles) {
            if (element2.Tiles.hasOwnProperty(key3)) {
              // Tile found
              const element3 = element2.Tiles[key3].CardID;
              // Filtering the userSettings data based on application ID
              myData = userSetCards[role][element2.Tiles[key3].applicationID];
              // Looping the USers Settings data
              for (const key4 in myData) {
                if (myData.hasOwnProperty(key4) & (myData[key4] == true)) {
                  if (key4 == element3) {
                    console.log(key4, " >>> ", myData[key4]);
                    //////////////////////////////////////////////////////////////////////////////
                    // Here user setup is matched with the card setup... Build the card output
                    //////////////////////////////////////////////////////////////////////////////
                    let applicationID = element2.Tiles[key3].applicationID;
                    let q1 = JSON.stringify(element2.Tiles[key3].filters);
                    let query;
                    //let results;

                    if (applicationID == "MYDATA") {
                    } else {
                      switch (applicationID) {
                        case "MYDATA":
                          // code block
                          break;
                        case "EMPACC01":
                          query = EMPACC01.find(JSON.parse(q1));

                          break;
                        default:
                        // code block
                      }

                      // Select Fields
                      const fList = [];
                      if (element2.Tiles[key3].fieldList) {
                        const fields = element2.Tiles[key3].fieldList;
                        query = query.select(fields);
                        //console.log(fields);
                        const fList = element2.Tiles[key3].fieldList.split(" ");
                        console.log(fList);
                      }
                      //Sorting
                      if (element2.Tiles[key3].sortBy) {
                        const sortBy = element2.Tiles[key3].sortBy;
                        query = query.sort(sortBy);
                      } else {
                        query = query.sort("-createdAt");
                      }
                      // Check Limits
                      if (element2.Tiles[key3].limit) {
                        const limit =
                          parseInt(element2.Tiles[key3].limit, 10) || 5;
                        const startIndex = 0;
                        query = query.skip(startIndex).limit(limit);
                      }
                      // Populate connected fields
                      if (element2.Tiles[key3].populate) {
                        query = query.populate(populate);
                      }

                      const results = await query;
                      console.log("MyResults:", results);
                      js1 = {};
                      fList.forEach((ex1) => {
                        console.log("AG1 - ", ex1);
                        results.forEach((ex2) => {
                          if (ex1 == ex2) {
                            js1[ex1] = results[ex2];
                          }
                        });
                      });
                      //console.log(js1);
                    }

                    // Read Card Template
                    let fileName3 =
                      "../../cards/templates/" +
                      element2.Tiles[key3].Type +
                      "_template.json";
                    var cardTemp = require(fileName3);

                    //--------------------
                    //Set Header ... All Cards
                    cardTemp["sap.card"]["header"] =
                      element2.Tiles[key3].header;
                    //--------------------
                    //set group for object card
                    //object1
                    if (element2.Tiles[key3].Type == "object1") {
                      k = 0;
                      element2.Tiles[key3].groups.forEach((gr1) => {
                        cardTemp["sap.card"]["content"]["groups"][k] = gr1;
                        k = k + 1;
                      });
                    }
                    //--------------------
                    //set group for object card
                    //table1
                    if (element2.Tiles[key3].Type == "table1") {
                      k = 0;
                      element2.Tiles[key3].columns.forEach((col1) => {
                        cardTemp["sap.card"]["content"]["row"]["columns"][
                          k
                        ] = col1;
                        k = k + 1;
                      });
                    }
                    //--------------------
                    //set group for action card
                    //object1
                    if (element2.Tiles[key3].Type == "object1") {
                      k = 0;
                      element2.Tiles[key3].actions.forEach((el1) => {
                        cardTemp["sap.card"]["content"]["actions"][k] = el1;
                        k = k + 1;
                      });
                    }
                    //list2
                    if (element2.Tiles[key3].Type == "list2") {
                      k = 0;
                      element2.Tiles[key3].actions.forEach((el1) => {
                        cardTemp["sap.card"]["content"]["item"]["actions"][
                          k
                        ] = el1;
                        k = k + 1;
                      });
                    }
                    let myD = {};
                    if (
                      element2.Tiles[key3].Type == "list1" ||
                      element2.Tiles[key3].Type == "list2" ||
                      element2.Tiles[key3].Type == "timeline1" ||
                      element2.Tiles[key3].Type == "quicklinks1"
                    ) {
                      /// Add Data
                      myD["json"] = { ...jsonArray };
                      cardTemp["sap.card"]["content"]["data"] = myD;
                      jsonArray = [];
                    }
                    if (element2.Tiles[key3].Type == "table1") {
                      /// Add Data
                      myD["json"] = { ...jsonArray };
                      cardTemp["sap.card"]["data"] = myD;
                      jsonArray = [];
                    }
                    if (element2.Tiles[key3].Type == "object1") {
                      /// Add Data
                      myD["json"] = { ...jsonObject };
                      cardTemp["sap.card"]["data"] = myD;
                      jsonObject = {};
                    }

                    counter = counter + 1;
                    let TileID = element2.Tiles[key3].Type + "_" + counter;
                    myTiles[TileID] = cardTemp;

                    //////////////////////////////////////////////////////////////////////////////
                    // Ends
                    //////////////////////////////////////////////////////////////////////////////
                  }
                }
              }

              console.log("------------------");
            }
          }
          /// Add Tiles in the output........
          if (tab != "tab1") {
            cardTemplate = { ...myTiles };
          } else {
            for (const l1 in cardTemplate["Tabs"]) {
              if (
                cardTemplate["Tabs"].hasOwnProperty(l1) &
                (cardTemplate["Tabs"][l1]["TabID"] == tab)
              ) {
                const ele_001 = cardTemplate["Tabs"][l1];
                //console.log("Final", ele_001);
                cardTemplate["Tabs"][l1]["Tiles"] = { ...myTiles };
                myTiles = {};
              }
            }
          }
        }
      }
    }
  }
  res.status(200).json({ success: true, data: cardTemplate });

  // Find List of Apps for the Role
  //const Applist = await Approle.find({ role: role });
  //const AList = Applist[0].Apps;
  //console.log(cardConfig);

  /*   const card = adaptiveCard_card;
  c1 = JSON.stringify(card);
  console.log(card);
  //Update Card Header
  card["sap.app"]["title"] = "SmartApp Adaptive Cards";
  card["sap.app"]["subTitle"] = "SmartApp Adaptive Card subTitle";
  card["sap.app"]["shortTitle"] = "Employee Leave Status";
  card["sap.app"]["info"] = "Track Leave Details";
  card["sap.app"]["description"] = "Employee Leaves portal";

  console.log(c1);
  const cardType = "adaptiveCard_card";

  if (!card) {
    return next(
      new ErrorResponse(`Card not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({ success: true, cardType: cardType, data: card }); */
};
