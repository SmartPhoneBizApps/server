const { readData } = require("../../modules/config2");
const {
  getCard,
  findOneAppDatabyid,
  getNewConfig,
} = require("../../modules/config");
const { find } = require("../../models/access/User");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  outStru = {};
  // Card Template
  let cardConfigFile = "../../cards/cardConfig/card_template.json";
  var cardConfig = require(cardConfigFile);

  let cardConfigFile1 = "../../cards/cardConfig/analyticalCard_template.json";
  var anacardConfig = require(cardConfigFile1);

  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);
  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);

  // Global Cards
  let fileName2q = "../../cards/cardConfig/ALL_cardConfig.json";
  var GlobalCardConfig = require(fileName2q);

  // Table View
  for (const key in appconfig["tableConfig"]) {
    for (let g = 0; g < appconfig["tableConfig"][key]["cards"].length; g++) {
      if (appconfig["tableConfig"][key]["cards"][g] == "Analytical") {
        stru1 = anacardConfig["Structure"];
        t_type = "Analytical";
        let st1 = t_type + "_" + appData["ID"] + "_" + key;
        outStru[st1] = { ...stru1 };
        stru1["sap.card"] = {};
        stru1 = {};
        console.log("---------- A n a l y t i c a l ------------");
      }
      if (appconfig["tableConfig"][key]["cards"][g] == "Table") {
        hdr = {};
        xrow1 = {};
        col_table1 = [];
        xrow = {};
        json_table1 = [];
        mycard = {};
        t_type = "table1";
        stru = cardConfig["Structure"];
        tabFields = appconfig["tableConfig"][key]["tableCardFields"];
        console.log("------ T A B L E  - C A R D ----------");
        xc_table1 = {};
        xj_table1 = {};
        col_table1 = [];
        json_table1 = [];
        tdata = [];
        for (let b = 0; b < tabFields.length; b++) {
          xc_table1["title"] = tabFields[b];
          xc_table1["value"] = "{" + tabFields[b] + "}";
          xc_table1["identifier"] = false;
          col_table1.push({ ...xc_table1 });
          xc_table1 = {};
        }
        for (let u = 0; u < appData[key].length; u++) {
          for (let b = 0; b < tabFields.length; b++) {
            xj_table1[tabFields[b]] = appData[key][u][tabFields[b]];
          }
          json_table1.push({ ...xj_table1 });
          xj_table1 = {};
        }
        let st1 = t_type + "_" + appData["ID"] + "_" + key;
        nav = {};
        par = {};
        par1 = [];
        nav["type"] = "tabNavigation";
        nav["tab"] = key;
        par["parameters"] = nav;
        par["type"] = "Custom";
        par1.push(par);

        hdr = cardConfig["header"]["table1"];
        hdr["title"] = appconfig["tableConfig"][key]["title"];
        hdr["subTitle"] = "Recent Transactions";
        hdr["actions"] = par1;
        //hdr["actions"][0]["parameters"]["tab"] = key;
        //hdr["actions"][0]["parameters"]["type"] = "tabNavigation";

        xrow1["columns"] = col_table1;
        xrow["row"] = { ...xrow1 };
        xrow1 = {};
        tdata["json"] = json_table1;
        stru["sap.card"]["content"] = { ...xrow };
        xrow = {};
        stru["sap.card"]["type"] = "Table";
        stru["sap.card"]["header"] = { ...hdr };
        hdr = {};
        stru["sap.card"]["data"] = { ...tdata };
        tdata = {};

        outStru[st1] = { ...stru };
        stru["sap.card"] = {};
        stru = {};
      }
    }

    hdr["actions"] = [];
  }

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
    mycard["title"] = GlobalCardConfig[a]["title"];
    mycard["subTitle"] = GlobalCardConfig[a]["subTitle"];
    mycard["HeaderActionURL"] = GlobalCardConfig[a]["HeaderActionURL"];
    mycard["statusText"] = GlobalCardConfig[a]["statusText"];
    mycard["HeaderIcon"] = GlobalCardConfig[a]["HeaderIcon"];
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
      outStru[st1] = { ...rec2 };
      rec2["sap.card"] = {};
      rec2 = {};
    }
  }

  res.status(200).json({ success: true, data: outStru });
};
