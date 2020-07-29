const { readData } = require("../../modules/config2");
const {
  getCard,
  findOneAppDatabyid,
  getNewConfig,
} = require("../../modules/config");
// @desc      Get adaptiveCard_card
// @route     GET /api/v1/adaptiveCard_card/:id
// @access    Public
exports.getDetailCardsNew = async (req, res, next) => {
  // Read Global Card Configuration
  let t_item = {};
  var mycard = {};
  let outStru = {};

  let xjson = {};
  let timeline1_json = [];
  let json = [];

  let json_table1 = [];
  let xj_table1 = {};
  let col_table1 = [];
  let xc_table1 = {};

  let list2_json = [];
  let donut_content = [];
  let counter = [];
  let i = 0;

  let cardConfigFile = "../../cards/cardConfig/card_template.json";
  var cardConfig = require(cardConfigFile);

  // Read Color Configuration
  let fileNameColor = "../../config/colorConfig.json";
  var colorConfig = require(fileNameColor);

  // Read New Config File
  var appconfig = getNewConfig(req.params.app, req.params.role);

  // Read Data
  let query = readData(req.params.app, req, appconfig);
  let results = await query;

  // Global Cards
  let fileName2q = "../../cards/cardConfig/ALL_cardConfig.json";
  var GlobalCardConfig = require(fileName2q);

  // Get the Record
  let appData = await findOneAppDatabyid(req.params.record, req.params.app);

  for (let m = 0; m < results.length; m++) {
    if (results[m]["ID"] == appData["ID"]) {
      Stg1 = [];
      // Global Cards...
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
          for (let n = 0; n < results[m]["TransLog"].length; n++) {
            xjson["Icon"] = "sap-icon://accept";
            xjson["Title"] = results[m]["TransLog"][n]["Comment"];
            if (results[m]["TransLog"][n].hasOwnProperty("buttonName")) {
              xjson["Title"] =
                xjson["Title"] +
                " >> " +
                results[m]["TransLog"][n]["buttonName"];
              xjson["Icon"] =
                GlobalCardConfig[a]["Icons"][
                  results[m]["TransLog"][n]["buttonName"]
                ];
            }
            xjson["Time"] = new Date(results[m]["TransLog"][n]["TimeStamp"]);
            xjson["Description"] = results[m]["TransLog"][n]["UserName"];
            if (results[m]["TransLog"][n].hasOwnProperty("UserComment")) {
              xjson["Description"] =
                xjson["Description"] +
                " >> " +
                results[m]["TransLog"][n]["UserComment"];
            }
            timeline1_json.push({ ...xjson });
            xjson = {};
          }
          let rec2 = getCard(
            mycard,
            t_type,
            results,
            json,
            t_item,
            list2_json,
            donut_content,
            timeline1_json,
            col_table1,
            json_table1
          );
          let st1 = t_type + "_" + results[m]["ID"];
          // outStru[st1] = rec2;
          Stg1.push({ ...rec2 });
          rec2 = {};
        }
      }
      // App Specific Cards...(Table cards)

      for (const key in appconfig["tableConfig"]) {
        stru = cardConfig["Structure"];
        hdr = {};
        xrow1 = {};
        col_table1 = [];
        xrow = {};
        json_table1 = [];
        mycard = {};
        t_type = "table1";
        tabFields = appconfig["tableConfig"][key]["DisplayFields"];

        for (let w = 0; w < results[m][key].length; w++) {
          for (let b = 0; b < tabFields.length; b++) {
            xc_table1["title"] = tabFields[b];
            xc_table1["value"] = "{" + tabFields[b] + "}";
            xc_table1["identifier"] = false;
            col_table1.push({ ...xc_table1 });
            xj_table1[tabFields[b]] = results[m][key][w][tabFields[b]];
          }
          json_table1.push({ ...xj_table1 });
          xj_table1 = {};
        }
        let st1 = t_type + "_" + results[m]["ID"] + "_" + key;
        hdr = cardConfig["header"]["table1"];
        hdr["title"] = appconfig["tableConfig"][key]["title"];
        hdr["subTitle"] = "Recent Transactions";
        xrow1["columns"] = col_table1;
        xrow["row"] = { ...xrow1 };
        tdata["json"] = json_table1;
        stru["sap.card"]["content"] = { ...xrow };
        stru["sap.card"]["type"] = "Table";
        stru["sap.card"]["header"] = { ...hdr };
        stru["sap.card"]["data"] = { ...tdata };
        outStru[st1] = { ...stru };
        st1 = "";
      }
    }
  }
  // for (let index = 0; index < Stg1.length; index++) {
  //  console.log(Stg1[index]);
  //  outStru[index] = { ...Stg1[index] };
  //}
  res.status(200).json({ success: true, data: outStru });
};
