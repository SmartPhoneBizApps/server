const {
  donutCard,
  lineCard,
  stackedcolumnCard,
  tableCard,
} = require("../../modules/config2");
const {
  getCard,
  findOneAppDatabyid,
  getNewConfig,
} = require("../../modules/config");

// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  outStru = {};
  // Card Template
  let cardConfigFile = "../../cards/cardConfig/card_template.json";
  var cardConfig = require(cardConfigFile);
  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);
  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);
  console.log("Application: ", req.params.app);
  // Global Cards
  let fileName2q = "../../cards/cardConfig/ALL_cardConfig.json";
  var GlobalCardConfig = require(fileName2q);
  // Header Cards...

  // Table Cards...
  cardArray = [];
  cardObj = {};
  counter = 0;
  cardKey = "";
  keyList = [];
  for (const key in appconfig["tableConfig"]) {
    // Loop at Tabs with Table views...
    console.log("----------------------------------");
    console.log("Cards for TabName : ", key);
    for (let g = 0; g < appconfig["tableConfig"][key]["cards"].length; g++) {
      counter = counter + 1;
      var mycard = {};
      mycard = appconfig["tableConfig"][key]["cards"][g];
      if (mycard["type"] == "Analytical") {
        let cardKey = "ANA" + "_" + appData["ID"] + "_" + key + counter;
        keyList.push(cardKey);
        console.log("** A n a l y t i c a l **");
        json1 = {};
        list1 = [];
        list1x = {};
        // -----------------------------------
        // Donut Card....
        // -----------------------------------
        if (mycard["analyticsCard"]["chartType"] == "donut") {
          console.log("** A n a l y t i c a l - Donut **");
          outStru2 = {};
          outStru2 = await donutCard(
            mycard["analyticsCard"],
            appData[key],
            outStru,
            appconfig["tableConfig"][key],
            appData["ID"],
            key
          );
          cardObj[cardKey] = { ...outStru2 };
          cardArray.push({ ...cardObj });
          console.log(cardObj[cardKey]["sap.card"]);
          cardObj = {};
          outStru2 = {};
        }
        // -----------------------------------
        // Line Card
        // -----------------------------------
        if (mycard["analyticsCard"]["chartType"] == "line") {
          console.log("** A n a l y t i c a l - Line **");
          outStru2 = {};
          outStru2 = await lineCard(
            mycard["analyticsCard"],
            appData[key],
            outStru,
            appconfig["tableConfig"][key],
            appData["ID"],
            key
          );
          cardObj[cardKey] = { ...outStru2 };
          cardArray.push({ ...cardObj });
          console.log(cardObj[cardKey]["sap.card"]);
          cardObj = {};
          outStru2 = {};
        }
        // -----------------------------------
        // Stacked Column
        // -----------------------------------
        if (mycard["analyticsCard"]["chartType"] == "stackedcolumn") {
          console.log("** A n a l y t i c a l - Stackedcolumn **");

          outStru = await stackedcolumnCard(
            mycard["analyticsCard"],
            appData[key],
            outStru,
            appconfig["tableConfig"][key],
            appData["ID"],
            key
          );
        }
      }
      if (mycard["type"] == "Table") {
        let cardKey = "TAB" + "_" + appData["ID"] + "_" + key + counter;
        keyList.push(cardKey);
        t_type = "table1";
        stru = cardConfig["Structure"];
        tabFields = mycard["tableCardFields"];

        console.log("** T A B L E  - C A R D **");
        outStru2 = await tableCard(
          tabFields,
          appData[key],
          cardConfig,
          appconfig,
          appData["ID"],
          key
        );
        cardObj[cardKey] = { ...outStru2 };
        cardArray.push({ ...cardObj });
        console.log(cardObj[cardKey]["sap.card"]);
        cardObj = {};
        outStru2 = {};
      }
      //      let st1 = t_type + "_" + appData["ID"] + "_" + key;
    }
  }

  hdr["actions"] = [];

  // Golobal
  hdr = {};
  hdr["actions"] = {};
  xrow1 = {};
  col_table1 = [];
  xrow = {};
  json_table1 = [];
  mycard = {};

  let list2_json = [];
  let donut_content = [];
  let xjson = {};
  let timeline1_json = [];
  let json = [];
  for (let a = 0; a < GlobalCardConfig.length; a++) {
    t_type = "";
    mycard = {};
    t_type = GlobalCardConfig[a]["cardType"];
    mycard = { ...GlobalCardConfig[a] };
    if (GlobalCardConfig[a]["cardType"] == "timeline1") {
      t_item = GlobalCardConfig[a]["ListItem"]["item"];
      timeline1_json = [];

      for (let n = 0; n < appData["TransLog"].length; n++) {
        xjson["Icon"] = "sap-icon://accept";
        xjson["Title"] = appData["TransLog"][n]["Comment"];
        if (appData["TransLog"][n].hasOwnProperty("buttonName")) {
          xjson["Title"] =
            xjson["Title"] + " >> " + appData["TransLog"][n]["buttonName"];
          xjson["Icon"] =
            GlobalCardConfig[a]["Icons"][appData["TransLog"][n]["buttonName"]];
        }
        xjson["Time"] = new Date(appData["TransLog"][n]["TimeStamp"]);
        xjson["Description"] = appData["TransLog"][n]["UserName"];
        if (appData["TransLog"][n].hasOwnProperty("UserComment")) {
          xjson["Description"] =
            xjson["Description"] +
            " >> " +
            appData["TransLog"][n]["UserComment"];
        }
        timeline1_json.push({ ...xjson });
        xjson = {};
      }
      let rec2 = getCard(
        mycard,
        t_type,
        appData,
        json,
        t_item,
        list2_json,
        donut_content,
        timeline1_json,
        col_table1,
        json_table1
      );
      let st1 = t_type + "_" + appData["ID"];

      cardObj[cardKey] = { ...rec2 };
      cardArray.push({ ...cardObj });
      console.log(cardObj[cardKey]["sap.card"]);
      cardObj = {};
      rec2 = {};
    }
  }

  for (let y = 0; y < cardArray.length; y++) {
    keyList.forEach((kk1) => {
      if (cardArray[y].hasOwnProperty(kk1)) {
        outStru[kk1] = { ...cardArray[y][kk1] };
      }
    });
  }

  res.status(200).json({ success: true, data: outStru });
};
